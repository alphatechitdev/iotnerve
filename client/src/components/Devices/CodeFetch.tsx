

import axios from "axios";
import { useState } from "react";
import './CodeFetch.css'
const CodeFetch = ({selectedDevice, authentication}) => {

    const [codeMessage, setCodeMessage] = useState('');

    const fetchCode = async (device_type) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/code/FetchCode?device_type=${device_type}`);
            return response.data[0].code_template;

            
        } catch (error) {
            console.error("Error While Fetching Code, ", error);
            return "";
        }
    }

    const downloadCode = async (selectedDevice, authentication) => {
        setCodeMessage("Getting Code Ready....")
        const code = await fetchCode(selectedDevice.device_type);
        console.log("Code", code);
        setCodeMessage("Using Credentials/Keys...")
        const mqtt_port = authentication.mqtt_port;
        const data_pin = selectedDevice.data_pin;
        const relay_pin = selectedDevice.relay_pin;
        const activeCode = code
        .replace("${ssid}", "Write Your Wifi Name Here...")
        .replace("${password}", "Write Your Wifi Password Here...")
        .replace("${mqtt_server}", authentication.mqtt_server)
        .replace("${mqtt_port}", `${mqtt_port}`) // Ensure it's a string
        .replace("${username}", authentication.username)
        .replace("${mqtt_password}", authentication.mqtt_password) // Corrected this
        .replace("${sensor_pin}", `${data_pin}`) // Replace with a string
        .replace("${relay_pin}", `${relay_pin}`) // Replace with a string
        .replace("${client_id}", authentication.client_id)
        .replace("${mqtt_control_topic}", selectedDevice.mqtt_control_topic)
        .replace("${mqtt_data_topic}", selectedDevice.mqtt_topic);

        const blob = new Blob([activeCode], { type: "text/cpp" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedDevice.device_name}_config.cpp`;
        link.click();
      };



    return (
        <div className="code-fetch">
            <h3>Ready To Fetch & Configure Code?</h3>
            <button onClick={() => downloadCode(selectedDevice, authentication)}>Download Code</button>
            <p>{codeMessage}</p>
        </div>
    )
}

export default CodeFetch;