"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import './GetServerAccess.css';
import { useWork } from "../Context/Work.Context";
import { getCreds } from "@/types/mqttcreds.types";
import { useAuth } from "../Context/Auth.Context";

const GetServerAccess = () => {
    const { selectedProfile,setSelectedComponent} = useWork();
    const {setIsAuthenticated, isAuthenticated} = useAuth();
    const [connectionCred, setConnectionCred] = useState({ username: "", password: "" });
    const [activeCreds, setActiveCreds] = useState<getCreds["details"][]>();
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [resetPrompt, setResetPrompt] = useState(false);
    const [showCreds, setShowCreds] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConnectionCred((prevData) => ({ ...prevData, [name]: value }));
    };
    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/protected/protected-route`, {withCredentials:true})
    
            if(!response.data.success) {
                setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Auth verification failed, ", error);
            setIsAuthenticated(false);
          }
        }
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (showCreds) {
            const fetchCreds = async () => {
                const profile_id = selectedProfile;
                const creds_mode = 'DS';
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/get-details`, {profile_id, creds_mode }, {withCredentials:true});
                    setActiveCreds(response.data.creds);
                } catch (error) {
                    console.error("Error fetching credentials:", error);
                }
            };
            fetchCreds();
        }
    }, [showCreds, selectedProfile]);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("Authenticating With Server...");
        try {
    
            if (!isAuthenticated) {
                alert("Login Expired! Please log in again.");
                return;
            }

            const submissionData = {
                ...connectionCred,
                selectedProfile
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/register-client`,
                submissionData,
                { headers: { 'Content-Type': 'application/json' }, withCredentials:true }
            );

            if (response.data.success) {
                setSuccessMessage("Device Authentication Successful! Your credentials are now active.");
                setShowCreds(true);
            } else {
                setSuccessMessage("Authentication Failed. Try Again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setSuccessMessage("An error occurred during authentication.");
        }
    };

    const handleResetPassword = async (reg_id:string) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/reset-cred/${reg_id}`, { oldPassword, newPassword });
            if (response.data.reset) {
                setSuccessMessage("Password Reset Successfully!");
            }
        } catch (error) {
            console.error("Error resetting credential:", error);
        }
    };

    return (
        <main className="server-access-container">
            <section className="info-section">
                <h2>🔗 Get Server Access & Connect Your Device</h2>
                <p>
                    By obtaining server access, you will receive a **Username** and **Password** that will allow your IoT device to
                    connect securely to the **AlphaConnectHub Server**. Once connected, your device can **send real-time data** and view **live data streams**.
                </p>

                <h3>📌 Steps to Connect Your Device:</h3>
                <ul>
                    <li>1️⃣ Create a **Username** and **Password** using the form given.</li>
                    <li>2️⃣ Register your credentials to activate server access.</li>
                    <li>3️⃣ Use the credentials in your device’s MQTT/IoT configuration.</li>
                    <li>4️⃣ Start sending and monitoring real-time data instantly!</li>
                </ul>
            </section>

            <div className="cred-container">
                <button className="show-auth-btn" onClick={() => setShowCreds(true)}>🔍 Show My Credentials</button>

                {showCreds && activeCreds && (
                    <div className="active-creds">
                        <h3>🔐 Active Credentials:</h3>
                        <ul>
                            {activeCreds.map((cred) => (
                                <li key={cred.reg_id} className="cred-item">
                                    <strong>Username:</strong> {cred.username} <br />
                                    <strong>Password:</strong> *********  
                                    <button className="reset-btn" onClick={() => setResetPrompt(true)}>🔄 Reset Password</button>

                                    {resetPrompt && (
                                        <div className="reset-box">
                                            <input
                                                type="password"
                                                name="oldpassword"
                                                placeholder="Type Old (current) Password"
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                name="newpassword"
                                                placeholder="Type New Password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button onClick={() => handleResetPassword(cred.reg_id)}>Confirm Reset</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form className="cred-set" onSubmit={handleSubmit}>
                    <h3>🛠 Create Your Device Credentials</h3>
                    <label>Set Username:</label>
                    <input
                        name="username"
                        type="text"
                        value={connectionCred.username}
                        onChange={handleChange}
                        placeholder="Enter Username"
                    />

                    <label>Password:</label>
                    <input
                        name="password"
                        type="password"
                        value={connectionCred.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                    />

                    <button type="submit">🚀 Register & Connect</button>
                    <p id="successMessage">{successMessage}</p>
                </form>
            </div>
        </main>
    );
};

export default GetServerAccess;