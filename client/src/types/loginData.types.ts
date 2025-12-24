


export interface LoginData {
  email: string;
  password: string;
}

export interface LoginError {
  Login?: string;
}


export interface BackendResponse {
  success: boolean;
  account?: boolean;
  message?: string;
}