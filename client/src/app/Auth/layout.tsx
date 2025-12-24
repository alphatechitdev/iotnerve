import { AuthProvider } from "@/components/Context/Auth.Context";
import { ReactNode } from "react";



export default function AuthLayout ({children}:{children:ReactNode}) {
    return (
        <div>
            <AuthProvider>
            {children}
            </AuthProvider>
        </div>
    )
}