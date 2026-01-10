import express, {Request, Response}from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
const DeviceRoutes = express.Router();
import DevicesController  from '../controllers/devices.controller';
import verifyProfileToUser from '@/utilities/verifyProfile';


DeviceRoutes.get('/get-devices', verifyToken, async (req : Request, res:Response)=>{  
    try{
        const profile_id = req.query.profile_id as string;
        const device_id = null;

        const result = await DevicesController.getDevices(device_id, profile_id, req.user);

        if(!result.fetch) {
            res.status(404).json({fetch:false,result:[]})
        } else {
            res.status(200).json({result})
        }
    } catch (error) {
        console.error("Internal Server Error!", error)
        res.status(500).json({message:"Internal Server Error!"})
    }
})

DeviceRoutes.delete('/delete-device/:device_id', verifyToken, async (req:Request, res:Response) => {
    try {
        const device_id = req.params.device_id;

        const result = await DevicesController.deleteDevice(device_id, req.user);

        if(result.success) {
            res.status(200).json({delete:true})
        } else if(!result.success) {
            res.status(403).json({delete:false})
        }
    } catch (error) {
        res.status(500).json({delete:false, message:"Could Not Delete Device"})
    }
});

DeviceRoutes.post('/reg-device', verifyToken, async (req:Request, res:Response)=>{
    try {
        const { user_id, profile_id} = req.body;

        verifyProfileToUser(user_id, profile_id);


        const result = await DevicesController.regDevice(req.body);

        if(result.reg) {
            res.status(200).json({result})
        } else if(!result.reg) {
            res.status(400).json({result})
        }

    } catch (error) {
        console.error("Internal Server Error!")
        res.status(500).json({message:"Internal Server Error!"})
    }
})

DeviceRoutes.get('/data', async (req, res)=>{

    try {
        const {data} = req.body;

    } catch (error) {
        console.error("Error While Getting Device Data")
        res.status(500).json({message:"Internal Server Error"})
    }
})


export default DeviceRoutes;

