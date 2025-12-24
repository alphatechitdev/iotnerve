import DevicesController from '@/controllers/devices.controller';
import express, {Request, Response} from 'express';
const CodeRoutes = express.Router();

CodeRoutes.get('/FetchCode', async (req:Request, res:Response) => {
    try {
        const device_type = req.query.device_type as  string;
        const result = await DevicesController.getDeviceCode(device_type);

        if(result.length>0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json("")
        }
    } catch (error) {
        console.error("Error In FetchCode Route/Function, ", error);
        res.status(500).json({"Error In FetchCode Route/Function, ": error});
    }
})

export default CodeRoutes;


