const mqtt = require("mqtt");
import bcrypt from "bcrypt";
import { AuthenticationCreds } from "@/types/mqttclient.types";
import DevicesController from "./devices.controller";
import MQTTCredsController from "./mqttCreds.controller";

// Temporary in-memory store to simulate Redis
export const tempStore = {
    data: {},
    async set(key, value) {
        this.data[key] = value;
    },
    async get(key) {
        return this.data[key] || null;
    }
};

class MqttClient {
    constructor() {
        this.mqtt_url = `ws://${process.env.MQTT_BROKER_ADDRESS}:8083/mqtt`; // ✅ Set MQTT URL here
        this.mcc = new MQTTCredsController();
        this.dv = new DevicesController();
        this.client = null;
        this.client_id = null;
        this.clientOF = true;
        this.dataBuffer = [];  // Store incoming data temporarily
        this.cleanupInterval = null; // Timer for auto-cleanup
    }

    // Authenticate user and subscribe
    async authenticateClient(AuthCreds:AuthenticationCreds) {
        try {
            const {res, user_id, profile_id, password, password_flag} = AuthCreds;
            
            const credentials = await this.mcc.getCred(user_id, profile_id, "WS", password_flag);
               
            const authenticated = await bcrypt.compare(password, credentials.details[0].password_hash);
    
            if (!authenticated) {
                console.error("Authentication Failed");
                return res.status(401).json({ auth: false });
            }
    
            await this.connectClient(credentials, password);
            return res.status(200).json({ auth: true });
    
        } catch (err) {
            console.error("Authentication Error:", err);
            return res.status(500).json({ auth: false, error: "Internal Server Error" });
        }
    }

    // Connect to MQTT Server
async connectClient(credentials, password) {
    try {
        // Ensure client is not already initialized
        if (this.client) {
            console.log("Already connected to MQTT server");
            return;
        }

        this.client = mqtt.connect(this.mqtt_url, {
            username: credentials.details[0].username,
            password: password,
            clientId: credentials.details[0].client_id,
            keepalive: 60,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            clean: true,
            protocolVersion: 4
        });

        this.client.on('connect', async () => {
            console.log('Connected to MQTT');
            this.client_id = credentials.details[0].client_id;
            await tempStore.set(`mqtt_connected_${this.client_id}`, 'true');
            await tempStore.set(`mqtt_connection_start_${this.client_id}`, Date.now().toString());
            this.clientOF = false;
        });

        this.client.on('error', (err) => {
            console.error('MQTT Connection Error:', err);
        });

    } catch (err) {
        console.error('Error during Connection:', err);
    }
}

    async resetOnStartup() {
        await tempStore.set(`mqtt_connected_${this.client_id}`, 'false');
        await tempStore.set(`mqtt_connection_start_${this.client_id}`, '0');
    }

    disconnectClient() {
        if (this.client && this.client.connected) {
            // Unsubscribe first
            this.client.unsubscribe("#", (err) => {
                if (err) {
                    console.error("Error unsubscribing:", err);
                } else {
                    console.log("Successfully unsubscribed from all topics.");
    
                    // Now disconnect the client
                    this.client.end(true, async () => {
                        console.log("MQTT connection closed!");
    
                        // Reset connection status in the temporary store
                        await tempStore.set(`mqtt_connected_${this.client_id}`, 'false');
                        await tempStore.set(`mqtt_connection_end_${this.client_id}`, Date.now().toString());
    
                        // Set the client state to "off"
                        this.clientOF = true;
                    });
                }
            });
        } else {
            console.log("No active MQTT client to disconnect.");
            // Log the state of this.client to diagnose further
            console.log("Current client state:", this.client);
        }
    }
    

    getClient() {
        return this.client;
    }
}

// ✅ Exporting the MQTT client instance so it can be used in other modules
export const mqttInstance = new MqttClient();
export const getClient = () => mqttInstance.getClient();
