import { ReactNode } from "react";



export interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean | null) => void;

  selectedComponent: string;
  setSelectedComponent: (value: string) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

