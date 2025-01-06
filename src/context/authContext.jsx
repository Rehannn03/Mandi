import { createContext,useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/api";

const AuthContext=createContext();

export function AuthProvider({children}){
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()


    // useEffect(()=>{
    //     checkAuth()
    // },[])

    // const checkAuth=async()=>{
    //     try {
    //         const response=await authService.getInfo()
    //         if(response.statusCode===200){
    //             setUser(response.message)
    //         }else{
    //             navigate('/login')
    //         }
    //     } catch (error) {
    //         console.error('Auth check failed:', error)
    //         setUser(null)
    //     } finally{
    //         setLoading(false)
    //     }
    // }

    const login=async(email,password)=>{
        try {
            const response=await authService.login(email,password)
            setUser(response.message)
            // await checkAuth()
            return response
        } catch (error) {
            throw error
        }
    }

    const logout=async()=>{
        try {
            await authService.logout()
            setUser(null)
            localStorage.removeItem('token')
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        } finally{
            setLoading(false)
        }
    }


    return (
        <AuthContext.Provider value={{user,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=() => useContext(AuthContext)
