import { AuthProvider } from "@/components/Context/Auth.Context";
import { WorkProvider } from "@/components/Context/Work.Context";
import Header from "@/components/Header/Header";
import ProtectedRoute from "@/components/Protected/ProtectedRoute";
import { ReactNode } from "react";



export default function DashboardLayout({children}:{children:ReactNode}) {

    return (
        <>
        <AuthProvider>
            <ProtectedRoute>
            <WorkProvider>
                <Header/>
                {children}
            </WorkProvider>
             </ProtectedRoute>
        </AuthProvider>
        </>
    )
}