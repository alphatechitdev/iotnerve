import {Response, Request} from 'express';
import { getClient } from './mqttClient.controller';
import DevicesController from './devices.controller';
import { sendToFrontend } from '@/socketService';
import {MqttClient, IClientSubscribeOptions, Packet} from 'mqtt';
const {connectDB} = require('../configs/mongodbconfig');


class MQTTDataController {

    private dataBuffer: any[];
    private cleanupInterval: NodeJS.Timeout | null;

    constructor() {
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

    static async getIoTData(topic:string, user_id:string){
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
    async subscribeToData(res:Response, req: Request, device_id:string, profile_id:string) {
        try {

            const deviceData = await DevicesController.getDevices(device_id, profile_id, req.user);
                const topic = deviceData.result[0].mqtt_topic;
                const client : MqttClient | null = getClient();
                if (!client) {
                    return res.status(500).json({live:false});
                }
                client.subscribe(topic, (err:Error|null) => {
                    if (!err) {
                        console.log(`Subscribed to topic: ${topic}`);
                        res.status(200).json({live:true});

                    } else {
                        console.error('Subscription error:', err);
                        res.status(500).json({live:false});
                    }
                });
            

                client.on("message", (topic:string, message:Buffer, packet:Packet) => {
                const msg = message.toString();
                console.log(`Received message on ${topic}: ${msg}`);

                // Store message in buffer
                this.dataBuffer.push({ topic, message: msg });
                this.saveIoTData(topic, msg, req.user);
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


export default MQTTDataController;