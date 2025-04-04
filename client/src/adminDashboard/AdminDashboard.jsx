import React, { useState } from "react";
import {
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
  FaUsers,
  FaUserCheck,
  FaHome,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaComment,
} from "react-icons/fa";
import { adminLogout } from "../services/userservices";
import { clearUser } from "../redux/Slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import ProviderTable from "./ProviderTable";
import OrdersTable from "./OrderTable";
import { persistor } from "../redux/store";
import AdminProfile from "./AdminProfile";
import AdminPayments from "./AdminPayments";
import AdminReviews from "./AdminReviews";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("provider");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const breadcrumbMap = {
    provider: "Providers",
    customers: "Customers",
    order: "Orders",
    profile: "Profile",
    payments: "Payments",
    reviews: "Reviews",
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "customers":
        return <CustomerTable />;
      case "provider":
        return <ProviderTable />;
      case "order":
        return <OrdersTable />;
      case "profile":
        return <AdminProfile />;
        case "reviews":
        return <AdminReviews />;
      case "payments":
        return <AdminPayments />;
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
    <div className="flex min-h-screen relative">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="space-y-4">
          <MenuItem label="Providers" icon={<FaUserCheck />} isActive={activeMenu === "provider"} onClick={() => setActiveMenu("provider")} />
          <MenuItem label="Customers" icon={<FaUsers />} isActive={activeMenu === "customers"} onClick={() => setActiveMenu("customers")} />
          <MenuItem label="Orders" icon={<FaShoppingCart />} isActive={activeMenu === "order"} onClick={() => setActiveMenu("order")} />
          <MenuItem label="Reviews" icon={<FaComment />} isActive={activeMenu === "reviews"} onClick={() => setActiveMenu("reviews")} />

          <MenuItem label="Payments" icon={<FaCreditCard />} isActive={activeMenu === "payments"} onClick={() => setActiveMenu("payments")} />
          <MenuItem label="Profile" icon={<FaUser />} isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          <MenuItem label="Logout" icon={<FaSignOutAlt />} isActive={false} onClick={handleLogout} isLogout />
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-100 p-4 lg:p-6">
        {/* Breadcrumb & Hamburger */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm flex-wrap">
            <FaHome className="text-blue-500" />
            <span className="mx-2">
              <FaChevronRight />
            </span>
            <span className="text-blue-500 font-semibold">Dashboard</span>
            <span className="mx-2">
              <FaChevronRight />
            </span>
            <span className="text-gray-900 font-semibold">
              {breadcrumbMap[activeMenu]}
            </span>
          </div>
          <button className="lg:hidden text-gray-800" onClick={() => setSidebarOpen(true)}>
            <FaBars size={24} />
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

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

export default AdminDashboard;
