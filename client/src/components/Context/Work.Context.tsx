"use client";
import {
  useContext,
  createContext,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "./Auth.Context";
import { WorkContextType, WorkProviderProps } from "@/types/work.types";


const WorkContext = createContext<WorkContextType | undefined>(undefined);

// ====================================
// 👉 3. PROVIDER
// ====================================

export const WorkProvider = ({ children }: WorkProviderProps) => {
  const [logoutFlag, setLogoutFlag] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [workSpaceState, setWorkSpaceState] = useState<boolean>(false);

  const { setIsAuthenticated, setSelectedComponent, selectedComponent } =
    useAuth();

  const router = useRouter();

  // -----------------------------
  // LOGOUT HANDLER
  // -----------------------------

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/user/logout`,
        {},
        { withCredentials: true }
      );

      // Clear state
      setIsAuthenticated(false);
      sessionStorage.removeItem("selectedComponent");
      router.push("/");

      console.log("User logged out, token removed");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // -----------------------------
  // PROVIDER RETURN
  // -----------------------------
  return (
    <WorkContext.Provider
      value={{
        logoutFlag,
        setLogoutFlag,

        selectedProfile,
        setSelectedProfile,

        workSpaceState,
        setWorkSpaceState,

        handleLogout,

        selectedComponent,
        setSelectedComponent,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};



export const useWork = (): WorkContextType => {
  const context = useContext(WorkContext);

  if (!context) {
    throw new Error("useWork must be used inside a WorkProvider");
  }

  return context;
};
