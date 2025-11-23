


"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaLightbulb, FaThermometerHalf, FaWifi, FaPlug } from "react-icons/fa";
import './DeviceShowcase.css';
const icons = [
  { id: 1, name: "Smart Light", icon: <FaLightbulb size={40} color="#FFD700" /> },
  { id: 2, name: "Thermostat", icon: <FaThermometerHalf size={40} color="#FF5733" /> },
  { id: 3, name: "Security Camera", icon: <FaCamera size={40} color="#1E90FF" /> },
  { id: 4, name: "WiFi Router", icon: <FaWifi size={40} color="#00FF7F" /> },
  { id: 5, name: "Smart Plug", icon: <FaPlug size={40} color="#FF4500" /> },
];

const DeviceShowcase = () => {
  const [index, setIndex] = useState(0);
  const current = icons[index];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="device-showcase">
      <motion.div
        className="device-box"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        key={current.id}
        
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            className="icon-animation"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            
          >
            {current.icon}
          </motion.div>
        </AnimatePresence>
        <p className="device-name">{current.name}</p>
      </motion.div>
    </div>
  );
};

export default DeviceShowcase;