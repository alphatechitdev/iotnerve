"use client";

import {ReactNode, useEffect} from "react";
import {useRouter} from "next/navigation";
import AuthLoadWindow from "../LoadingWindows/AuthLoadWindow";
import { useAuth } from "../Context/Auth.Context";

const ProtectedRoute = ({children}:{children:ReactNode}) => {
    const {isAuthenticated} = useAuth();
    console.log("IMP MAIN POINT ,", isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if(isAuthenticated == false) {
            router.push('/');
        }
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
        // While checking auth, show a loader or nothing
        return <AuthLoadWindow/>
    }

    
    
      return <>{children}</>;
}


export default ProtectedRoute;