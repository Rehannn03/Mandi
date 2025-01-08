import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider,useAuth } from './context/authContext'
import Login from './pages/Login'
import AddUser from './pages/Admin/AddUser'
import Ledger from './pages/Admin/Ledger'
import AdminDashboard from './pages/Admin/AdminDashboard'
import NewLedger from './pages/Admin/NewLedger'
import PreviousLedgers from './pages/Admin/PrevLedger'
import { Loader } from './components/Loader'
import './App.css'

const AdminRoute=({children})=>{
  const {user,loading}=useAuth()

  // if(loading){
  //   return <Loader/>
  // }
  if(!user || user?.user?.role!=='Admin'){
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
              <Route path='/admin/users' element={<AddUser/>}/>
              <Route path='/admin/ledger' element={<Ledger/>}/>
              <Route path='/admin/newLedger' element={<NewLedger/>}/>
              <Route path='/admin/resumeLedger' element={<NewLedger/>}/>
              <Route path='/admin/prevLedger' element={<PreviousLedgers/>}/>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
