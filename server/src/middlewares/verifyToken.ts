import {NextFunction, Request, Response} from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;



export const verifyToken = (req: Request, res:Response, next:NextFunction) => {
    const token = req.cookies[`${process.env.IN_AUTH_TOKEN_NAME}`];

    if (!token) {
        res.status(401).json({error:"Unauthorized!"})
    }

    jwt.verify(token, JWT_SECRET, (err:VerifyErrors, decoded:JwtPayload) => {
        if (err) res.status(403).json({error:"Forbidden"});
        req.user = decoded.user_id;
        next();
    })
}

