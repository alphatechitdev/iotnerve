



export interface RegisterCreds {
    name:string
    email:string
    recovery_email:string,
    password:string,
    package_id:string,
}


export interface LoginCreds {
    email:string,
    password:string
}