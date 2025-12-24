import { useEffect, useState } from "react";

const ConnectingWindow = () => {
  const messages = [
    "Waking up secure servers...",
    "Starting backend engine...",
    "Connecting to AlphaTech systems...",
    "Establishing a secure session...",
    "Almost there! Preparing your experience...",
    "Establishing a secure session...",
    "Thanks for your patience...",
    "Almost there! Preparing your experience..."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white">
      <p className="text-lg md:text-xl font-medium mb-6 animate-pulse">
        {messages[currentIndex]}
      </p>

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default ConnectingWindow;
