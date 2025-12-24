import {Response} from 'express';


export interface AuthenticationCreds {
    res: Response,
    user_id:string,
    profile_id:string,
    password:string,
    password_flag:boolean
}