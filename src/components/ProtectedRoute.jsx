import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";
import { Loader } from "./Loader";

export default function ProtectedRoute({children}) {
    const {user,loading}=useAuth()

    if(loading){
        return <Loader/>
    }

    if(!user){
        return <Navigate to='/login'/>
    }

    return children
}