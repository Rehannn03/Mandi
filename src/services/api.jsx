import axios from 'axios';

const api=axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
    }
})
const token=localStorage.getItem('token');
if(token){
    api.defaults.headers.common['Authorization']=`Bearer ${token}`;
}
{console.log(api.defaults.headers.common)}
export const authService={
    login: async(email,password)=>{
        try {
            const response=await api.post('/user/login',{email,password});
            if(response.data.statusCode===200){
                localStorage.setItem('token',response.data.message.token)
                return response.data
            }
            else {
                {console.log(response.message)}
                return response.error
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },

    logout:async ()=>{
        try {
            const response=await api.get('/user/logout')
            if(response.data.statusCode===200){
                localStorage.removeItem('token')
                delete api.defaults.headers.common['Authorization']
                return 'success'
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },

    getInfo: async()=>{
        try {
            const response=await api.get('/user/getInfo')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    }
}

export const adminService={
    addUser:async (userData)=>{
        try {
            const response=await api.post('/user/login',userData)
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    },
    prevLedger:async()=>{
        try {
            const response=await api.get('/ledger/getLedgersDate')
            if(response.data.statusCode===200){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || error
        }
    }   
}