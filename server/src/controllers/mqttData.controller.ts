import {Response} from 'express';
import { getClient } from './mqttClient.controller';
import MQTTCredsController from './mqttCreds.controller';
import DevicesController from './devices.controller';
const {connectDB} = require('../configs/mongodbconfig');


class MQTTDataController {

    private mcc : MQTTCredsController;
    private dataBuffer: any[];
    private cleanupInterval: NodeJS.Timeout | null;

    constructor() {
        this.mcc = MQTTCredsController;
        this.dataBuffer = [];  
        this.cleanupInterval = null; 
    }

    async saveIoTData(topic:string, data:string, user_id:string){
        const db = await connectDB();
        const collection = db.collection("deviceData");

        const newData = {
            user_id,
            topic,
            data,
            timestamp: new Date(),
        };

        await collection.insertOne(newData);

    }

    async getIoTData(topic:string, user_id:string){
        const db = await connectDB();
        const collection = db.collection("deviceData");

        const query = {
            user_id:user_id,
            topic: topic,
        }

        const results = await collection.find(query).toArray()

        return results;
    }
    

    // Subscribe to MQTT topic
    async subscribeToData(res:Response, device_id:string, profile_id:string) {
        try {

            const deviceData = await DevicesController.getDevices(device_id, profile_id);
                const topic = deviceData.result[0].mqtt_topic;
                const client = getClient();
                client.subscribe(topic, (err) => {
                    if (!err) {
                        console.log(`Subscribed to topic: ${topic}`);
                        res.status(200).json({live:true});

                    } else {
                        console.error('Subscription error:', err);
                        res.status(500).json({live:false});
                    }
                });
            

                client.on("message", (topic, message) => {
                const msg = message.toString();
                console.log(`Received message on ${topic}: ${msg}`);

                // Store message in buffer
                this.dataBuffer.push({ topic, message: msg });
                this.saveIoTData(topic, msg);
                sendToFrontend('mqtt_message', { topic, message: msg });

                // Start auto-cleanup timer if not already running
                if (!this.cleanupInterval) {
                    this.startAutoCleanup();
                }
            });

            client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
            });

        } catch (err) {
            console.error('Error during subscription:', err);
        }
    }

  

    // Auto-clear data every 5 minutes
    startAutoCleanup() {
        this.cleanupInterval = setInterval(() => {
            console.log("Auto-cleaning data buffer...");
            this.clearDataBuffer();
        }, 5 * 60 * 1000); // 5 minutes
    }

    // Clear data buffer and stop the cleanup timer
    clearDataBuffer() {
        this.dataBuffer = [];
        console.log("Data buffer cleared.");

        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}


module.exports = new MQTTDataController();
