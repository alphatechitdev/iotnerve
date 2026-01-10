"use client";
import React, { useState, useEffect } from "react";
import './Devices.css';
import axios from 'axios';
import { io } from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CodeFetch from "./CodeFetch";
import {Trash2, PlugZap, Power} from 'lucide-react';
import { useAuth } from "../Context/Auth.Context";
import { useWork } from "../Context/Work.Context";
import { deviceDetails } from "@/types/device.types";
import { getCreds } from "@/types/mqttcreds.types";


const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}`, {withCredentials:true}); 


interface operationalData {
    topic:string;
    message:string
}
interface mongodbData {

    user_id:string;
    topic:string;
    data:string
    timestamp:Date,
}

const Devices = () => {
  const {setIsAuthenticated} = useAuth();
  const {setSelectedComponent, selectedProfile , setLogoutFlag} = useWork();


  const profile_id = selectedProfile;
  const [user_id, setUser_id] = useState<string | null>("")
  const [devices, setDevices] = useState<deviceDetails[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<deviceDetails | null>(null);
  const [mqtt, setMQTT] = useState(true)
  const [operationData, setOperationData] = useState<operationalData[]>([]);
  const [authentication, setAuthentication] = useState<getCreds["details"] | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [serverInfoVisible, setServerInfoVisible] = useState(false);
  const [dataBaseMode, setDataBaseMode] = useState(false);
  const [mongodbData, setMongodbData] = useState<mongodbData[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [codeProcess, setCodeProcess] = useState(false);
  const [mqttCurrentConnect, setMqttCurrentConnect] = useState({
    connected: false,
    since:null
  });


  // Fetch devices and authentication details
  const closeConnection = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/disconnect-mqtt`, {withCredentials:true});
    if(response.data.close === true){
      setOperationData([{topic:"",message:"Operational Data Closed. View Collected Data from Database or Restart MQTT"}])
    }
    fetchStatus();
    
  }

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/status`, {withCredentials:true});

      setMqttCurrentConnect({
        connected: response.data.connected,
        since: response.data.since
      })
    } catch (error) {
      console.error("Error While Fetching The State, ",error);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, [])

  useEffect(() => {
    const fetchDataBaseData = async (device:deviceDetails) => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/get-mqtt-mongodb?topic=${device.mqtt_topic}`, {withCredentials:true});

      const responseData = response.data;
      setMongodbData(responseData);
    
    }
    if(selectedDevice){
      fetchDataBaseData(selectedDevice);
    }
  }, [dataBaseMode])


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/protected/protected-route`, {withCredentials:true})

        if(response.data.success) {
          setIsAuthenticated(true);
          setUser_id(response.data.user_id);
        } else {
          setIsAuthenticated(false);
          setLogoutFlag(true);
          setSelectedComponent("")
          setUser_id(null);
        }
      } catch (error) {
        console.error("Auth verification failed, ", error);
        setIsAuthenticated(false);
        setSelectedComponent("")
        setLogoutFlag(false);
        setUser_id(null);
      }
    }
    checkAuthentication();
}, []);
  useEffect (() => {
   if (!mqtt) {
    closeConnection();
   }

  }, [mqtt])
  useEffect(() => {
    console.log("Updated Devices:", devices);
  }, [devices]); // This ensures you see the latest devices state
  
  useEffect(() => {
    const fetchDevices = async () => {
     
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/devices/get-devices?user_id=${user_id}&profile_id=${profile_id}&_=${new Date().getTime()}`, {withCredentials:true});
        if(response.data){
          console.log("Devices Fetch")
          setDevices([]);
          setDevices(response.data.result.result);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    

    const fetchConnectionDetails = async () => {
      if (!profile_id || !user_id) return;
      if (profile_id && user_id) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/get-details`, {
            user_id,
            profile_id,
            creds_mode: 'DS'
          }, 
        {withCredentials:true});
          const creds = response.data?.creds?.[0];
          if (creds) setAuthentication(creds.details);
        } catch (error) {
          console.error("Error fetching authentication details:", error);
        }
      }
    };

    fetchDevices();
    fetchConnectionDetails();
  }, [profile_id, user_id]);

  // Handle MQTT messages
  useEffect(() => {
    socket.on("mqtt_message", (data) => {
      console.log("MQTT Message Received:", data);
      setOperationData((prevData) => [...prevData, data]);
    });

    // Cleanup socket listener on unmount
    return () => {
      socket.off("mqtt_message");
    };
  }, []);

  // Debugging: Log updates when operationData changes
  useEffect(() => {
    console.log("Updated Operational Data:", operationData);
  }, [operationData]);

  const handleDeviceDeletion = async (device_id:string) => {

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/devices/delete-device/${device_id}`, {withCredentials:true});

    if(response.data.delete) {
      alert("Device Deleted Refresh Your Page!")
    } else {
      alert("Could Not Delete!")
    }
  }

  // Fetch operational data after authentication
  const connectMQTTServer = async () => {
    if (!username || !password) {
      alert("Please enter your credentials.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/connectClient`, {
        user_id,
        profile_id,
        password,
      }, 
      {withCredentials:true}
    );


      if (response.data) {
        setIsAuthModalOpen(false);
        alert("Successfully authenticated and Connected to MQTT!");
        fetchStatus();
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error fetching operational data:", error);
      alert("An error occurred while fetching operational data.");
    }
  };

  // Fetch operational data after authentication
  const fetchOperationalData = async () => {
    if (!username || !password) {
      alert("Connect To MQTT First...");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/mqtt/subscribeData`, {
        profile_id,
        device_id: selectedDevice?.device_id,
      }, 
      {withCredentials:true}
    );

      if (response.data.live) {
        alert("Successfully subscribed to Live Data!");
      } else if (!response.data.live){
        alert("Live Request Failed. Please check your credentials Or Try Again!");
      }
    } catch (error) {
      console.error("Error fetching operational data:", error);
      alert("An error occurred while fetching operational data.");
    }
  };

  
  
  return (
    <div className="deviceTab">
      <div className="deviceList">
        <h2>Devices</h2>
        <button
        style={{
          backgroundColor:"red",
          padding:'4px',
          borderRadius:'5px',
        }}
        onClick={() => setMQTT(false)}><PlugZap/> Disconnect MQTT</button>
        <br/>
        <button style={{
          backgroundColor:"green",
          padding:'4px',
          borderRadius:'5px',
          marginTop:'4px',
        }} onClick={() => setIsAuthModalOpen(true)}>
          <Power/>
              {mqttCurrentConnect.connected ? "Connected" : "Connect"}

              </button>
            
        <ul>
  
          {devices.map((device) => (
            <li
              key={device.device_id}
              onClick={() => setSelectedDevice(device)}
              className={selectedDevice?.device_id === device.device_id ? "active" : ""}
            >
              {device.device_name}
            </li>
          ))}
        </ul>
      </div>

      {isAuthModalOpen && (
        <div className="authModal">
          <h3>Authentication Required</h3>
          <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </form>
          <button style={{
            backgroundColor:"green"
          }} onClick={connectMQTTServer}>Authenticate</button>
  
          <button onClick={() => setIsAuthModalOpen(false)}>Cancel</button>
          <button style={{
            backgroundColor:"orange"
          }} onClick={() => setSelectedComponent('Server')}>Forgot Username/Password? Reset</button>
        </div>
      )}


      <div className="deviceDetails">
        {selectedDevice ? (
          <div>
            <h3>{selectedDevice.device_name}</h3>
            <p><strong>Type:</strong> {selectedDevice.device_type}</p>
            <p><strong>Handler:</strong> {selectedDevice.device_handler}</p>
            <p><strong></strong></p>
            <button onClick={() => setCodeProcess(true)}>Get Connection Code(.cpp)</button>
            {codeProcess && selectedDevice &&
            <CodeFetch selectedDevice={selectedDevice} authentication={authentication}/>

            }
            <button className="server-info-button" onClick={() => setServerInfoVisible(true)}>Get Connection Access Info</button>

            {serverInfoVisible && (
  <div className="serverInfo">
    <h3>🔐 Server Info (Connection Access)</h3>
    <p><strong>Server Address:</strong> {authentication?.mqtt_server}</p>
    <p><strong>Server Port:</strong> {authentication?.mqtt_port}</p>
    <p><strong>Server URL:</strong> <code>ws://{authentication?.mqtt_server}:{authentication?.mqtt_port}/mqtt</code></p>
    <p><strong>Device Topic:</strong> <code>{selectedDevice.mqtt_topic}</code></p>
  </div>
)}

            <h3>Note!!!</h3>
            <p><strong>Review Your Code</strong> Before Uploading To Your IoT Device.</p>
            <p><strong>Use Suggested IDE Platform IDE / Arduino IDE</strong> To Upload The Code To IoT Device.</p>
            <p>Also, <strong>Make Sure You Have The Correct Board And Port Selected</strong></p>

            
            
            <button onClick={() => fetchOperationalData(true)}>View Live Operational Data</button>
            <br/>
            <button style = {{marginTop:'5px'}} onClick={() => setDataBaseMode(true)}>View Collected Data</button>
            <br/>
            <button style={{backgroundColor:"red", padding:'2px', borderRadius:'5px' , marginTop:'5px'}} onClick={() => handleDeviceDeletion(selectedDevice.device_id)}><Trash2 size={18}/> Delete Device</button>
          </div>
        ) : (
          <p>Select a device to view details</p>
        )}
      </div>

      {dataBaseMode && (
  <div className="databasemode">
    <h2>Collected Data</h2>
    
    {mongodbData.length > 0 ? (
      <>
        {/* Graph */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mongodbData.slice(-10)}> {/* Show only last 10 */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide={true} /> {/* Hide timestamp for clarity */}
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="data" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        {/* Limited Data List */}
        <div className="dataList">
          {mongodbData.slice(-10).map((data, index) => (
            <div key={index} className="dataRow">
              <p><strong>Timestamp:</strong> {data.timestamp}</p>
              <p><strong>{selectedDevice?.unit_name}:</strong> {data.data}</p>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p>Loading Data...</p>
    )}
  </div>
)}
   
      <div className="operationData">
        <h3>Operational Data</h3>
        {operationData.length > 0 ? (
          <div className="dataContainer">
            {operationData.map((data, index) => (
              <div key={index} className="dataRow">
                <p>{selectedDevice? selectedDevice.unit_name:""}:{data.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No Live operational data available...Check IoT Device</p>
        )}
      </div>
    </div>
  );
};

export default Devices;