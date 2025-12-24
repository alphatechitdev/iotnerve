import supabase from "@/configs/serverdb.config";
import { connectionCreds } from "@/types/mqttcreds.types";
import hashPassword from "@/utilities/hashing";

class MQTTCredsController {
    constructor () {

    }

    
    static async getCred(user_id:string, profile_id:string, creds_mode:string, password_flag:boolean) {
    
        try {
            let query;
    
            if (password_flag) {
                query = supabase
                    .from('mqtt_users_cred')
                    .select('reg_id, username, mqtt_server, mqtt_port, client_id')
                    .eq('user_id', user_id)
                    .eq('profile_id', profile_id)
                    .eq('creds_mode', creds_mode);
            } else {
                query = supabase
                .from('mqtt_users_cred')
                .select('reg_id, username, mqtt_server, mqtt_port, client_id, password_hash')
                .eq('user_id', user_id)
                .eq('profile_id', profile_id)
                .eq('creds_mode', creds_mode);
            }
    
            const { data, error } = await query;  // Execute the query
    
            if (error) {
                console.error("Error While Fetching:", error.message);
                return { cred: false };
            }
    
            return data.length > 0 ? { cred: true, details: data } : { cred: false };
        } catch (error) {
            console.error("Unexpected Error Fetching:", error);
            return { cred: false };
        }
    }
    

    static async addUserToEMQX (connectionCreds:connectionCreds) {
        try {

            const {user_id, username, password, selectedProfile} = connectionCreds;

            const password_hash = await hashPassword(password);
            const profile_id = selectedProfile; 


            const {data, error} = await supabase.from('mqtt_users_cred').insert([
                {user_id, username,password_hash, profile_id, creds_mode:'DS' },
                {user_id, username,password_hash, profile_id, creds_mode:'WS' }
            ]).select('reg_id');

            if(error) {
                console.error("Error While Registering For MQTT ", error);
                return {success:false};
            }
            if(data.length>0){
                return {success:true, reg_id:data[0].reg_id, username:username};
            }
        } catch (error) {
            console.error('Error adding user to EMQX:', error);
            return {success:false};
        }
    }


    static async resetPassword(reg_id:string, user_id:string, password:string){

        try {
            const password_hash = await hashPassword(password);

            const {data, error} = await supabase
            .from('mqtt_users_cred')
            .update({password_hash})
            .eq('reg_id', reg_id)
            .eq('user_id', user_id)
            .select('username')


            if(error) {
                console.error("Error While Reseting", error);
                return {reset:false}
            } 
            if(data.length>0){
                console.log("Reset Success!")
                return {reset:true}
            } else {
                console.log("Failed")
                return {reset:false}
            }
        } catch (error) {
            console.error("Error While Reseting, ", error);
            return {reset:false}
        }

    }


    
}

export default MQTTCredsController;
