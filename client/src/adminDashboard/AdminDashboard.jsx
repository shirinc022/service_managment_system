import React, { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaUser, FaSignOutAlt, FaUsers, FaUserCheck } from "react-icons/fa";
import { adminLogout } from "../services/userservices";
import { clearUser } from "../redux/Slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import ProviderTable from "./ProviderTable";
import OrdersTable from "./OrderTable";
import { persistor } from "../redux/store";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("provider");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeMenu) {
      case "customers":
        return <CustomerTable />;
      case "provider":
        return <ProviderTable />;
      case "order":
        return <OrdersTable />;
      case "profile":
        return <Profile />;
      default:
        return <h1 className="text-xl">Select a section</h1>;
    }
  };

  const handleLogout = () => {
    try {
      adminLogout().then(() => {
        persistor.purge();
        dispatch(clearUser());
        navigate("/");
      });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6 text-center">Admin Dashboard</h2>
        <ul className="space-y-4">
          <MenuItem label="Providers" icon={<FaUserCheck />} isActive={activeMenu === "provider"} onClick={() => setActiveMenu("provider")} />
          <MenuItem label="Customers" icon={<FaUsers />} isActive={activeMenu === "customers"} onClick={() => setActiveMenu("customers")} />
          <MenuItem label="Orders" icon={<FaShoppingCart />} isActive={activeMenu === "order"} onClick={() => setActiveMenu("order")} />
          <MenuItem label="Profile" icon={<FaUser />} isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          <MenuItem label="Logout" icon={<FaSignOutAlt />} isActive={false} onClick={handleLogout} isLogout />
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 flex flex-col">
    
          {renderContent()}
        
      </div>
    </div>
  );
}

// Reusable Sidebar Menu Item
function MenuItem({ label, icon, isActive, onClick, isLogout }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center gap-2 p-2 w-full text-left rounded transition-colors cursor-pointer
          ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700"} 
          ${isLogout ? "hover:bg-red-600" : ""}`}
      >
        {icon} {label}
      </button>
    </li>
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

export default AdminDashboard;
