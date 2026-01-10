


"use client";
import React, { useState, useEffect} from "react";
import axios from "axios";
import './AddDevice.css';
import { useWork } from "../Context/Work.Context";
import { useAuth } from "../Context/Auth.Context";
import { addDeviceDetails } from "@/types/device.types";

const AddDevice = () => {
  const {selectedProfile} = useWork();
  const profile_id = selectedProfile;
  const {setSelectedComponent,setIsAuthenticated} = useAuth();

    const [deviceDetails, setDeviceDetails] = useState<addDeviceDetails>({
        device_name: "",
        device_type: "",
        description: "",
        device_handler: "",
        unit_name:"",
        data_pin:"",
        relay_pin:"",
    });
    const [user_id, setUser_id] = useState(null);
    console.log("prof", profile_id)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/protected/protected-route`, {withCredentials:true})
    
            if(response.data.success) {
              setIsAuthenticated(true);
              setUser_id(response.data.user_id);
            } else {
              setIsAuthenticated(false);
              setSelectedComponent("")
              setUser_id(null);
            }
          } catch (error) {
            console.error("Auth verification failed, ", error);
            setIsAuthenticated(false);
            setUser_id(null);
          }
        }
        checkAuthentication();
    });

    const sensorTemplates = {
        analog: [
          {
            sensor_name: "LM35",
            unitName: "Temperature (°C)",
            library: "",
            pins: ["analog"],
            read_function: "analogRead({PINS}) * (3.3 / 4095.0) * 100",
          },
        ],
        digital: [
          {
            sensor_name: "DHT22",
            unitName: "Temperature (°C), Humidity (%)",
            protocol: "OneWire",
            library: "Adafruit DHT Sensor Library",
            pins: ["data"],
            read_function: {
              temperature: "sensor.readTemperature()",
              humidity: "sensor.readHumidity()",
            },
          },
          {
            sensor_name: "Motion Detector",
            unitName: "Motion Detected (Yes/No)",
            library: "",
            pins: ["data"],
            read_function: "digitalRead({PINS})",
          },
        ],
        i2c: [
          {
            sensor_name: "BME280",
            unitName: "Temperature (°C), Pressure (hPa), Humidity (%)",
            library: "Adafruit BME280 Library",
            pins: ["SDA", "SCL"],
            read_function: {
              temperature: "sensor.readTemperature()",
              pressure: "sensor.readPressure()",
              humidity: "sensor.readHumidity()",
            },
          },
        ],
        spi: [
          {
            sensor_name: "MAX6675",
            unitName: "Temperature (°C)",
            library: "Adafruit MAX6675 Library",
            pins: ["CS", "SCK", "MISO"],
            read_function: "sensor.readCelsius()",
          },
        ],
        custom: [],
      };
      
        const deviceTypes =  [
          {
            "name": "Temperature Sensor",
            "unitName": "Temperature (°C)",
            "defaultDataPin": 4,
            "defaultRelayPin": 2,
            "category": "digital"
          },
          {
            "name": "Humidity Sensor",
            "unitName": "Humidity (%)",
            "defaultDataPin": 5,
            "defaultRelayPin": 2,
            "category": "digital"
          },
          {
            "name": "Air Quality Sensor",
            "unitName": "Air Quality Index (AQI)",
            "defaultDataPin": 34,
            "defaultRelayPin": 2,
            "category": "analog"
          },
          {
            "name": "Motion Detector",
            "unitName": "Motion Detected (Yes/No)",
            "defaultDataPin": 13,
            "defaultRelayPin": 2,
            "category": "digital"
          },
          {
            "name": "Light Sensor",
            "unitName": "Light Intensity (Lux)",
            "defaultDataPin": 36,
            "defaultRelayPin": 2,
            "category": "analog"
          },
          {
            "name": "Gas Sensor",
            "unitName": "Gas Concentration (PPM)",
            "defaultDataPin": 35,
            "defaultRelayPin": 2,
            "category": "analog"
          },
          {
            "name": "Water Flow Sensor",
            "unitName": "Flow Rate (L/min)",
            "defaultDataPin": 14,
            "defaultRelayPin": 2,
            "category": "digital"
          },
          {
            "name": "Vibration Sensor",
            "unitName": "Vibration Level (Hz)",
            "defaultDataPin": 32,
            "defaultRelayPin": 2,
            "category": "analog"
          },
          {
            "name": "GPS Module",
            "unitName": "Location (Latitude, Longitude)",
            "defaultDataPin": 17,
            "defaultRelayPin": null,
            "category": "i2c"
          },
          {
            "name": "Smart Plug",
            "unitName": "Power Status (On/Off)",
            "defaultDataPin": null,
            "defaultRelayPin": 2,
            "category": "digital"
          }
        
        ]
      
      
    
    const deviceHandlers = [
        "ESP-32",
        "Arduino",
        "Raspberry-Pi",
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name === 'device_type') {
            const selectedType = deviceTypes.find((type) => type.name === value);

            setDeviceDetails((prev) => ({
                ...prev,
                [name]:value,
                unit_name:selectedType.unitName,
                data_pin: selectedType ? selectedType.defaultDataPin : "",
                relay_pin: selectedType ? selectedType.defaultRelayPin : "",
            }))
        } else {
            setDeviceDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    const generateMQTTTopic = () => {
        return `user/${user_id}/profile/${profile_id}/device/${deviceDetails.device_name.replace(/\s+/g, '_')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mqtt_topic = generateMQTTTopic();

        try {
            setSuccessMessage("Authenticating With Servers...");
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/devices/reg-device`, {
                ...deviceDetails,
                user_id,
                profile_id,
                mqtt_topic
            });
           

            if (response.data.result.reg) {
                setSuccessMessage("✅ Device added successfully!");
                setDeviceDetails({ device_name: "", device_type: "", description: "" });
            } else {
                setErrorMessage("❌ Failed to add device.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("❌ An error occurred while adding the device.");
        }
    };

    return (
        <div className="add-device-container">
            <h2>Add New IoT Device</h2>

            {successMessage && <p className="success" >{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label>Device Name:</label>
                <input
                    type="text"
                    name="device_name"
                    value={deviceDetails.device_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter device name"
                />

                <label>Device Type:</label>
                <select
                    name="device_type"
                    value={deviceDetails.device_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type, index) => (
                        <option key={index} value={type.name}>{type.name}</option>
                    ))}
                </select>

                <label>Device Handler:</label>
                <select
                    name="device_handler"
                    value={deviceDetails.device_handler}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Device Handler</option>
                    {deviceHandlers.map((handler, index) => (
                        <option key={index} value={handler}>{handler}</option>
                    ))}
                </select>

                <label>Data Pin:</label>
                <input type="text" name="data_pin" onChange={handleChange} value={deviceDetails.data_pin || ""}  />

                <label>Relay Pin:</label>
                <input type="text" name="relay_pin" onChange={handleChange} value={deviceDetails.relay_pin || ""}  />

                <label>Description:</label>
                <textarea
                    name="description"
                    value={deviceDetails.description}
                    onChange={handleChange}
                    placeholder="Describe the device"
                ></textarea>

                <button type="submit">Add Device</button>
            </form>
        </div>
    );
};

export default AddDevice;
