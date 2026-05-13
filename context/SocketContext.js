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

    // Socket.io has been removed from the server for Vercel compatibility.
    // We'll return null for now to avoid connection errors in the console.
    return;

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
