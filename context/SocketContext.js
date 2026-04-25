/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Replace with your server URL from env
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const socketUrl = apiUrl.replace("/api/v1", "");

    // Vercel serverless functions do not support persistent Socket.io connections.
    // Skip connection on Vercel to avoid 404 errors in console.
    if (socketUrl.includes("vercel.app")) {
      console.warn(
        "--- Socket: Environment detected as Vercel. Connection skipped (Not Supported) ---",
      );
      return;
    }

    const socketInstance = io(socketUrl, {
      reconnectionAttempts: 2,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("--- Socket: Connection Registered ---", socketInstance.id);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
