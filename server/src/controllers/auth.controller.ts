import supabase from "@/configs/serverdb.config";
import { LoginCreds, RegisterCreds } from "@/types/authcreds.types";
import hashPassword, { verifyPassword } from "@/utilities/hashing";
import {v4 as uuid} from "uuid";
import UAParser from "ua-parser-js";
import {Request} from "express";
import redis from "@/lib/redis";

class AuthController {
    constructor () {

    }

    static async signUp (regData:RegisterCreds) {


        const {name, email, recovery_email, password, package_id} = regData

        const hashed_password = await hashPassword(password);


        const {data, error} = await supabase.from('users').insert([
            {
                name,
                email,
                recovery_email,
                hashed_password,
                package_id
            }
        ])
        .select('user_id')

        if (error) {
            console.error("Error While Registering!", error.message)
            return {success:false, message:"Error Registering"};
        }
        const user_id = data[0];
        return {success:true, message:"Registered Successfuly", user_id}
    }


    static async login(loginData:LoginCreds) {
        const {email, password} = loginData;
        console.log(email, password);

        const {data, error} = await supabase.from('users').select('hashed_password , user_id').eq('email', email)

        if (error) {
            console.log("Error While Logging In", error)
        }

        if(data.length == 0) {
            console.log("Account Not Registered")
            return {success:false, account:false, message:"Account Not Registered"}
        }

        const hashed_password = data[0].hashed_password
        const user_id = data[0].user_id

        const isAuthenticated = await verifyPassword(hashed_password, password);

        if (!isAuthenticated) {
            console.log("Invalid Password")
            return {success:false, account:true, message:"Account Not Registered"}
        }
        
        
        return {success:true, account:true, user_id, message:"Login Successful"}

    }

    
}


export default AuthController;

