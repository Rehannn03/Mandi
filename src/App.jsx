import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider,useAuth } from './context/authContext'
import Login from './pages/Login'
import AdminDashboard from './pages/Admin/AdminDashboard'
import { Loader } from './components/Loader'
import './App.css'

const AdminRoute=({children})=>{
  const {user,loading}=useAuth()

  if(loading){
    return <Loader/>
  }

  if(!user || user?.message?.role!=='admin'){
    return <Navigate to='/' replace/>
  }

  return children
}


function App() {



  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/admin' element={
              <AdminRoute>
                <AdminDashboard/>
              </AdminRoute>
            }>
              
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
