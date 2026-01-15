import express from 'express';
import { verifyToken } from "@/middlewares/verifyToken";
import ProfileController from '@/controllers/profile.controller';
const ProfileRoutes = express.Router();

ProfileRoutes.get('/getProfiles', verifyToken, async (req, res) => {
    try {

        const result = await ProfileController.getProfiles(req.userId);

        if(result.fetch) {
            res.status(200).json({success:true, profiles:result.profile})
        } else {
            res.status(400).json({success:false, profile:""})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
});

ProfileRoutes.post('/addProfile', verifyToken, async (req, res) => {
    try {
        const {profile_name, description} = req.body;
        const result = await ProfileController.addProfile({profile_name, description, user_id:req.userId});

        if(result.make) {
            res.status(200).json({success:true, profiles:result.profile})
        } else if (!result.make){
            res.status(400).json({success:false, profile:""})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

ProfileRoutes.delete('/deleteProfile/:profile_id', verifyToken, async (req, res) => {
    const {profile_id} = req.params;

    const result = await ProfileController.deleteProfile(profile_id,req.userId);
    if(result.delete){
        res.status(200).json({success:true, message:"Profile deleted"});
    } else if (!result.delete){
        res.status(400).json({success:false, message:"Profile not deleted"});
    }
});


export default ProfileRoutes;