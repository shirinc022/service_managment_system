import React from 'react'
import { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/Slices/userSlice';
import { providerLogout } from '../services/userservices';

function ProviderDashboard() {
        const [activeMenu, setActiveMenu] = useState("orders");
        const navigate = useNavigate()
        const dispatch = useDispatch()
    
        const renderContent = () => {
          switch (activeMenu) {
            case "orders":
              return <Orders />;
            case "payments":
              return <Payments />;
            case "profile":
              return <Profile />;
            default:
              return <h1 className="text-xl">Select a section</h1>;
          }
        };

         
                  const handleLogout = () => {
                    try {
                      providerLogout().then((res) => {
                        // persistor.purge()
                        dispatch(clearUser());
                        navigate('/');
                      });
                    } catch (error) {
                      console.log("error");
                    }
                  };
    
  return (
     <div className="flex h-screen">
     {/* Sidebar */}
     <div className="w-64 bg-gray-900 text-white p-4">
       <h2 className="text-xl font-bold mb-6 text-center">Provider Dashboard</h2>
       <ul className="space-y-4">
         <MenuItem 
           label="Orders" 
           icon={<FaShoppingCart />} 
           isActive={activeMenu === "orders"} 
           onClick={() => setActiveMenu("orders")}
         />
         <MenuItem 
           label="Payments" 
           icon={<FaCreditCard />} 
           isActive={activeMenu === "payments"} 
           onClick={() => setActiveMenu("payments")}
         />
         <MenuItem 
           label="Profile" 
           icon={<FaUser />} 
           isActive={activeMenu === "profile"} 
           onClick={() => setActiveMenu("profile")}
         />
         <MenuItem 
           label="Logout" 
           icon={<FaSignOutAlt />} 
           isActive={false} 
           onClick={handleLogout}
           isLogout
         />
       </ul>
     </div>
 
     {/* Content Area */}
     <div className="flex-1 p-6 bg-gray-100">{renderContent()}</div>
   </div>
 );
 }
 
 // Reusable Sidebar Menu Item
 function MenuItem({ label, icon, isActive, onClick, isLogout }) {
 return (
   <li>
     <button
       onClick={onClick}
       className={`flex items-center gap-2 p-2 w-full text-left rounded transition-colors  cursor-pointer
         ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700"} 
         ${isLogout ? "hover:bg-red-600" : ""}`}
     >
       {icon} {label}
     </button>
   </li>
 );
 }
 
 // Orders Component
 function Orders() {
 return (
   <div className="p-6 bg-white text-gray-900 shadow-md rounded">
     <h1 className="text-2xl font-bold">My Orders</h1>
     <p className="mt-4">View your past and current orders.</p>
   </div>
 );
 }
 
 // Payments Component
 function Payments() {
 return (
   <div className="p-6 bg-white text-gray-900 shadow-md rounded">
     <h1 className="text-2xl font-bold">Payments</h1>
     <p className="mt-4">Manage your payment methods and transactions.</p>
   </div>
 );
 }
 
 // Profile Component
 function Profile() {
 return (
   <div className="p-6 bg-white text-gray-900 shadow-md rounded">
     <h1 className="text-2xl font-bold">My Profile</h1>
     <p className="mt-4">Update your personal details and preferences.</p>
   </div>
 );
 }
 

export default ProviderDashboard
