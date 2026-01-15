import redis from '@/lib/redis';
import { verifyToken } from '@/middlewares/verifyToken';
import express from 'express';
const ProtectedRoutes  = express.Router();


ProtectedRoutes.get('/protected-route', verifyToken , (req , res) => {
    const session = redis.get(`session:${req.sessionId}`);
    if (!session) {
        res.status(401).json({message:"Session Expired"})
    }
    res.status(200).json({success:true, user_id:req.userId})
});

export default ProtectedRoutes;