import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { LayoutDashboard,UserPlus,Book ,LogOut,BookOpen,Menu,X,CirclePlus} from "lucide-react";
import {Link,useLocation,Outlet} from 'react-router'
import { Loader } from "../../components/Loader";

function AdminDashboard() {
    const {user,loading,logout}=useAuth()
    const location=useLocation()
    const [mobileMenuOpen,setMobileMenuOpen]=useState(false)

    const menuItems=[
        {
            name:'Dashboard',
            icon:LayoutDashboard,
            link:'/admin'
        },
        {
            name:'Add Users',
            icon:UserPlus,
            link:'/admin/users'
        },
        {
            name:'Ledger',
            icon:Book,
            link:'/admin/ledger'
        },
        {
            name:'Khaatas',
            icon:BookOpen,
            link:'/admin/khaatas'
        },
        {
          name:'Add Bakra',
          icon:CirclePlus,
          link:'/admin/addBakra'
        }
    ]

    const toggleMobileMenu=()=>{
        setMobileMenuOpen(!mobileMenuOpen)
    }

    if(loading){
        return <Loader/>
    }

    return (
      <div className="min-h-screen h-screen flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-20 text-[#1E3A8A]"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#E5E7EB] overflow-y-auto ${mobileMenuOpen ? 'fixed inset-0 z-10' : 'hidden lg:block'}`}>
        <div className="p-4">
          <h1 className="text-xl font-bold text-[#1E3A8A] mb-8 font-inter">
            Admin Dashboard
          </h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  location.pathname === item.link
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#111827] hover:bg-[#E5E7EB]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium font-roboto">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-2.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors lg:absolute lg:bottom-4 w-full lg:w-64"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium font-roboto">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#F9FAFB]">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl lg:text-2xl font-bold text-[#1E3A8A] font-inter">
                Welcome, {user?.user?.name}
              </h1>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
    )
}

export default AdminDashboard