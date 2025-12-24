import jwt, { JwtPayload } from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET



const generateToken = (payload:JwtPayload) => {
   return jwt.sign(payload, secretKey as string, { expiresIn: '1h' });
}

export default generateToken;
