
export interface deviceDetails{
    user_id : string,
    profile_id: string,
    device_name: string,
    device_type: string,
    device_id?:string,
    device_handler: string,
    unit_name:string,
    data_pin:string,
    relay_pin:string,
    description:string,
    mqtt_topic:string
}

export interface addDeviceDetails{
    device_name:string,
    device_type:string,
    description:string,
    device_handler:string,
    unit_name:string,
    data_pin:string,
    relay_pin:string,
}