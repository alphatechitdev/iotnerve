import supabase from "@/configs/serverdb.config";
import { addDeviceParams } from "@/types/device.types";



class DevicesController {
    constructor (){

    }

    static async getMobDevices (user_id:string) {
        try {
        const {error, data} = await supabase.from('mob_devices').select('*').eq('user_id', user_id);

        if (error) {
            console.error("Error While fetching mobile devices (query), ", error);
            return {success:false, mob_devices:null};
        }

        return {success:true, mob_devices:data}

        } catch (error) {
            console.error("Error While fetching mobile devices, ", error);
            return {success:false, mob_devices:null};

        }
    }

     

    static async getDevices(device_id: string | null, profile_id: string, user_id: string){
       try {
        let query
        if (profile_id){
        query = supabase.from('devices').select('*').eq('profile_id', profile_id).eq('user_id',user_id);
        } else if (device_id){
            query = supabase.from('devices').select('*').eq('device_id', device_id).eq('user_id', user_id);
        } else {
            throw new Error("Either profile_id or device_id is required");
        }

        const {data, error} = await query;

        if(error) {
            console.error("Error While Fetching Devices", error)
            return {fetch:false, result:[]};
        }
        if(data.length>0) {
            return {fetch:true, result:data}
        } else {
            return {fetch:false, result:data}
        }
       } catch (error){
        console.log("Error!", error)
        return {fetch:false, result:[]};

       }

    }

    static async deleteDevice(device_id:string, user_id:string){
        try {
            const {data, error} =  await supabase.from('devices').delete().eq('device_id', device_id).eq('user_id', user_id);

            if(error) {
                console.error("Error deleting device:", error);
                return { success: false, message: "Failed to delete device" };
            }
                return { success: true, message: "Device deleted" };
    
        } catch (error) {
            console.error("Unexpected error:", error);
            return { success: false, message: "Unexpected error" };
        }
    }

    static async regDevice(deviceDetails:addDeviceParams){
        const {user_id, profile_id, device_name, device_type, device_handler, unit_name, data_pin, relay_pin, description, mqtt_topic} = deviceDetails; 

        const mqtt_control_topic = mqtt_topic+'/controls';

        const {data, error} = await supabase.from('devices').insert([
            {user_id,profile_id,device_name,device_type,description,device_handler,unit_name,data_pin,relay_pin,mqtt_topic, mqtt_control_topic}
        ]).select('device_id')

        if(error) {
            console.error("Error While Registering Device", error)
            return {reg:false, device:data}
        }

        return {reg:true, device:data}
    

    }


    static async getDeviceCode (device_type:string) {
        try {
            const {data, error} = await supabase.from('device_code').select('code_template').eq('device_type', device_type);

            if(error) {
                console.error("Error While Fetching Code Template, ", error);
                return [];
            }
            return data;
        } catch (error) {
            console.error("Unexpected error getDevice Function, ", device_type);
            return [];
        }
    }


    static async getControls(device_type:string) {
        try {
            const {data, error} = await supabase.from('controls').select('control_name').eq('device_type', device_type);

            if(error) {
                console.error("Error While Fetching Controls Info, ", error);
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error In Getting Controls Function, ", error);
            return [];
        }
    }
}

export default DevicesController;