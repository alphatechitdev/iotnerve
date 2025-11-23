"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContextType, AuthProviderProps } from "@/types/auth.types";


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/protected/protected-route`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setSelectedComponent("");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
        setSelectedComponent("");
      }
    };

    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        selectedComponent,
        setSelectedComponent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
