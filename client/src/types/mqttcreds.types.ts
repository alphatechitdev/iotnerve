








export interface connectionCreds{
    user_id:string;
    username:string;
    password:string;
    selectedProfile:string;
}

export interface getCreds{
    cred:boolean;
    details:{
    reg_id: string;
    username: string;
    mqtt_server: string;
    mqtt_port: number;
    client_id: string;
    password_hash?: string;
    };
}