
import { ReactNode } from "react";

export interface WorkContextType {
  logoutFlag: boolean;
  setLogoutFlag: (value: boolean) => void;

  selectedProfile: string;
  setSelectedProfile: (value: string) => void;

  workSpaceState: boolean;
  setWorkSpaceState: (value?: boolean) => void;

  handleLogout: () => Promise<void>;

  selectedComponent: string;
  setSelectedComponent: (value: string) => void;
}

export interface WorkProviderProps {
  children: ReactNode;
}

