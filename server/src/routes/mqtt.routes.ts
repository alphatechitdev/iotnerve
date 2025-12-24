/********** 📘 Devices Routes (OWASP) Status: Pass ✅ **********/



import express from 'express';
const MqttRoutes = express.Router();
const {mqttInstance, tempStore} = require('@/controllers/mqttClient.controller');
import { verifyToken } from '@/middlewares/verifyToken';
import MQTTCredsController from '@/controllers/mqttCreds.controller';
const mqttDataController = require('../controllers/mqttData.controller');
const verifyProfileToUser = require('../utilities/verifyProfileToUser');


MqttRoutes.put('/reset-cred/:reg_id', verifyToken, async (req, res) => {
    try {
        // Access Control (DB-Schema) 

        const reg_id = req.params.reg_id;
        const {password} = req.body

        const MCC = new MQTTCredsController();
        const result = await MCC.resetPassword(reg_id, req.user_id, password);

        if(result.reset) {
            res.status(200).json({reset:true,message:"Success"})
        } else if(!result.reset) {
            res.status(403).json({reset:false,message:"Reset Failed"})
        }
    } catch (error) {
        res.status(500).json({reset:false,message:"Reset Failed"})
    }
});


MqttRoutes.get('/get-mqtt-mongodb', verifyToken, async (req, res) => {
    // Access Control (DB-Schema) 
    const {topic} = req.query;
    const result = await mqttDataController.getIoTData(topic, req.user_id);
    res.status(200).json(result);
});




MqttRoutes.post('/register-client', verifyToken, async (req, res) => {

    try {
        const submissionData = req.body;
        const MCC =  new MQTTCredsController();
        const result = await MCC.addUserToEMQX(submissionData);

        if(result.success) {
            res.status(200).json({success:true, reg_id:result.reg_id})
        } else {
            res.status(400).json({success:false, message:"Registration Failed"})
        }
    } catch {
        res.status(500).json("Internal Server Error")
    }
});

MqttRoutes.post('/get-details', verifyToken, async (req, res) => {
    try {

        const {profile_id, creds_mode} = req.body;
        verifyProfileToUser(req.user_id, profile_id);
        const password_flag = false;
        const HC = new handleCred();
        const result = await HC.getCred(req.user_id,profile_id,creds_mode, password_flag);

        if(result.cred) {
            res.status(200).json({success:true, creds:result.details})
        } else {
            res.status(400).json({success:false, message:"Access Not Registered Yet"})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
});

MqttRoutes.post('/subscribeData', async (req, res) => {
    try {

        const {profile_id, device_id} = req.body;
        const result = await handleData.subscribeToData(res, device_id, profile_id);

    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
})

MqttRoutes.post('/connectClient', async (req, res) => {
    try {
        const {user_id,profile_id, password} = req.body;
        const password_flag = true;
        const result = await mqttInstance.authenticateClient(res,user_id,profile_id,password,password_flag);

    } catch (error) {
        console.error("Error While Connecting Client Route/Function, ", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
})

// Disconnect MQTT client when requested
MqttRoutes.post('/disconnect-mqtt', async (req, res) => {
    await mqttInstance.disconnectClient();
    res.status(200).json({close:true, message: 'MQTT disconnected successfully.' });
});

MqttRoutes.get('/status', async (req, res) => {
    const connected = await tempStore.get(`mqtt_connected_${mqttInstance.client_id}`);
    const startTime = await tempStore.get(`mqtt_connected_start${mqttInstance.client_id}`);
    

    res.json({
        connected: connected === 'true' ,
        since: startTime ? new Date(parseInt(startTime)).toLocaleString():null
    })
});


module.exports = MqttRoutes;