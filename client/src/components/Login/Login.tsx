"use client";

import axios from "axios";
import React, { useState } from "react";
import {jwtDecode} from 'jwt-decode';
import './Login.css';
import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConnectingWindow from '../LoadingWindows/ConnectingWindow';

const UserLogin = () =>{
    const {setIsAuthenticated, setSelectedComponent} = useAuth();
    const router = useRouter();
    
    const [loginData, setLoginData] = useState({
        email: "",
        password:""
    })


    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const  handleChange = (e) => {
        const {name, value} = e.target;

        setLoginData ((prevData) => ({
            ...prevData,
            [name] : value,
        }))

    }

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("Google User Data:", decoded);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/auth/google-login`, {
                id_token: credentialResponse.credential,
            },
            {
                withCredentials:true,
            }
            );
            const responseData = response.data;

            if(responseData.success){
            setSuccessMessage("Login Successful")
            setIsAuthenticated(true)
            setSelectedComponent("Devices")
            } else {
                console.error("Google Login Failed:", responseData.message);
            }
        }  catch (error) {
            console.error("Error in Google Login:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                Login: "Google Login Failed",
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setSuccessMessage("Logging You In...")
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/auth/login`, loginData, {
            headers : {
                'Content-Type' : 'application/json',
            },
            withCredentials:true
        })

        const responseData = response.data;

        if(responseData.success) {
            setSuccessMessage("Login Successful");
            setIsAuthenticated(true);
            router.push('/Devices');

        } else if (!responseData.account){
            setErrors((prevData) => ({
                ...prevData, 
                Login : "Account Not Found",
            }))
        } else {
           setErrors((prevData) =>({
            ...prevData,
            Login:"Invalid Password",
           }))
        }

    } catch (error) {
        setSuccessMessage("");
        if (error.response) {
            const backendError = error.response.data.message || "Unknown Error From Server"
            setErrors((prevData) => ({
                ...prevData,
                Login:backendError,
            }))
        } else if (error.request) {
            // No Response from Backend
            setErrors((prevData) => ({
                ...prevData,
                Login: "No Response from Server",
            }));
        } else {
            // Other Errors
            setErrors((prevData) => ({
                ...prevData,
                Login: "Unexpected Error While Logging In",
            }));
        }

       
    } finally {
        setIsLoading(false);
    }
    }



    return (

        <div className="userLogin-page">

            <h1>Login To Your Alpha Connect Hub</h1>
            

            <Link href = '/'>
            <button className="back-button">Visit Main Page</button>
            </Link>

            <form className="userLogin-form" onSubmit={handleSubmit}>

                <label htmlFor="email">Email:</label>
                <input 
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter Email..."
                />

                <br/>


                <label htmlFor="password">Password:</label>
                <input
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter Password..."
                />

                <br/>
                {successMessage && <p className="successMessage">{successMessage}</p>}
                
                <button type="submit">{isLoading ? "Logging In..." : "Login"}</button>
                <br/>
                {isLoading && (
                <ConnectingWindow/>
            )}
            </form>
            {errors.Login && <p className="errors">{errors.Login}</p>}
        </div>
    )
}


export default UserLogin;