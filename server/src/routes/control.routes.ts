import DevicesController from '@/controllers/devices.controller';
import express from 'express';
const ControlRoutes = express.Router();


ControlRoutes.get('/getControls', async (req, res) => {
    try {
        const device_type = req.query.device_type as string;
        const result = await DevicesController.getControls(device_type);
        if(result.length>0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result)
        }

    } catch (error){
        console.error("Error While Get Control Function/Routing, ", error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default ControlRoutes;