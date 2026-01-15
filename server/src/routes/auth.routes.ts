import express, {NextFunction, Request, Response} from 'express';
const AuthRoutes = express.Router();
import AuthController from '@/controllers/auth.controller';
import generateToken from '@/utilities/generateToken';
import {v4 as uuid} from 'uuid';
import UAParser from 'ua-parser-js';
import redis from '@/lib/redis';
import { verifyToken } from '@/middlewares/verifyToken';

AuthRoutes.post('/register', async (req:Request, res:Response)=>{
    try{
        const data = req.body;
        const result = await AuthController.signUp(data);

        if (result.success) {
            const user_id = result.user_id
            const token = generateToken({user_id});
            res.status(200).json({message:"Registration Success",success:true, user_id, token});
        } else {
            res.status(400).json({message:"Error Registering User",success:false});
        }
        
    } catch (error) {
        console.error("Error While Register, ", error)
        res.status(500).json({message:"Internal Server Error"})
    } 
})

AuthRoutes.post('/login', async (req:Request, res:Response) => {
    try {
        const loginData = req.body
        const result = await AuthController.login(loginData)

        if (!result.account) {
            return res.status(404).json({success: false, account: false, message:"Invalid Credentials"})
        }

        if (!result.success) {
            return res.status(400).json({success:false, account: true, message: "Invalid Password"})
        }

        const user_id = result.user_id

        const sid = uuid();
        const parser = new UAParser(req.headers["user-agent"]);
        const ua = parser.getBrowser().name + " on " + parser.getOS().name;

        await redis.set(``, JSON.stringify({
            userId:user_id,
            ip:req.ip,
            ua,
            createdAt: Date.now(),
        }), 
        "EX",
        60 * 60 * 24 * 7

    )
        const token = generateToken({userId:user_id, sessionId:sid});

        res.cookie(`${process.env.IN_AUTH_TOKEN_NAME}`, token, {
                sameSite:'none',
                httpOnly:true,
                secure:true,
                maxAge: 1000 * 60 * 60 * 2
            })
        console.log("Router 200")
        res.status(200).json({success:true, account: true, message:"Login Successful"})


    } catch (error) {
        console.error("Error While Login, ", error);
        res.status(500).json({message:"Internal Server Error"})
    }
});

AuthRoutes.post('/logout', async (req: Request, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies.IN_AUTH_TOKEN_NAME;
        if (!token) res.status(204);
        verifyToken(req, res, next);
        await redis.del(`session:${req.sessionId}`);
        res.clearCookie(`${process.env.IN_AUTH_TOKEN_NAME}`, {path:"/"});
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed" });
    }
});


export default AuthRoutes;