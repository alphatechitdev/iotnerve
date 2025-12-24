const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const ProfileController = require('../controllers/profile.controller');
const ProfileRoutes = express.Router();

ProfileRoutes.get('/getProfiles', verifyToken, async (req, res) => {
    try {

        const PC = new ProfileController();
        const result = await PC.getProfiles(req.user_id);

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
        const PC = new ProfileController();
        const result = await PC.addProfile({profile_name, description, user_id:req.user_id});

        if(result.make) {
            res.status(200).json({success:true, profiles:result.profile})
        } else if (!result.make){
            res.status(400).json({success:false, profile:""})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
});

ProfileRoutes.delete('/deleteProfile/:profile_id', verifyToken, async (req, res) => {
    const {profile_id} = req.params;

    const PC = new ProfileController();
    const result = await PC.deleteProfile(profile_id, {user_id:req.user_id});
    if(result.delete){
        res.status(200).json({success:true, message:"Profile deleted"})
    } else if (!result.delete){
        res.status(400).json({success:false, message:"Profile not deleted"})
    }
});


module.exports = ProfileRoutes;
