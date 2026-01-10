import { verifyToken } from '@/middlewares/verifyToken';
import express from 'express';
const ProtectedRoutes  = express.Router();


ProtectedRoutes.get('/protected-route', verifyToken , (req , res) => {
    res.status(200).json({success:true, user_id:req.user})
});

export default ProtectedRoutes;