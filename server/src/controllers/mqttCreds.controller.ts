import supabase from "@/configs/serverdb.config";
import { connectionCreds, getCreds } from "@/types/mqttcreds.types";
import hashPassword, { verifyPassword } from "@/utilities/hashing";

class MQTTCredsController {
    constructor () {

    }

    
    static async getCred(user_id:string, profile_id:string, creds_mode:string, password_flag:boolean) :Promise<getCreds>{
    
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
                return { cred: false , details:[]};
            }
    
            return { cred: true, details: data };
        } catch (error) {
            console.error("Unexpected Error Fetching:", error);
            return { cred: false, details:[]};
        }
    }
    

    static async addUserToEMQX (connectionCreds:connectionCreds, user_id:string) {
        try {

            const {username, password, selectedProfile} = connectionCreds;

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

            return {success:true, reg_id:data[0].reg_id, username:username};
            
        } catch (error) {
            console.error('Error adding user to EMQX:', error);
            return {success:false};
        }
    }


    static async resetPassword(reg_id:string, user_id:string, newPassword:string, oldPassword:string){

        try {
            const {data:user, error:fetchError} = await supabase
            .from('mqtt_users_cred')
            .select('password_hash')
            .eq('reg_id', reg_id)
            .eq('user_id', user_id)
            .single();

            if (fetchError || !user) {
                console.error("User Not Found, ", fetchError);
                return {reset:false};
            }

            const isValid = verifyPassword(user.password_hash, oldPassword);

            if (!isValid) {
                return {reset:false};
            }

            const new_password_hash = await hashPassword(newPassword);


            const {error:updateError} = await supabase
            .from('mqtt_users_cred')
            .update({password_hash:new_password_hash})
            .eq('reg_id', reg_id)
            .eq('user_id', user_id)
            .select('username')


            if(updateError) {
                console.error("Error While Reseting", updateError);
                return {reset:false}
            }

            console.log("Reset Success!");
            return {reset:true};
    
        } catch (error) {
            console.error("Error While Reseting, ", error);
            return {reset:false}
        }

    }


    
}

export default MQTTCredsController;
