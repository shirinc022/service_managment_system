import React, { useState } from "react";
import {
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
  FaTools,
  FaComment,
  FaHome,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/Slices/userSlice";
import { providerLogout } from "../services/userservices";
import ProviderServiceListing from "./ProviderServiceListing";
import ProviderOrders from "./ProviderOrders";
import { persistor } from "../redux/store";
import ProviderProfile from "./ProviderProfile";
import ProviderReviews from "./ProviderReviews";
import ProviderPayments from "./ProviderPayments";

function ProviderDashboard() {
  const [activeMenu, setActiveMenu] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const breadcrumbMap = {
    orders: "Orders",
    services: "Services",
    reviews: "Reviews",
    payments: "Payments",
    profile: "Profile",
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "services":
        return <ProviderServiceListing />;
      case "orders":
        return <ProviderOrders />;
      case "payments":
        return <ProviderPayments />;
      case "profile":
        return <ProviderProfile />;
      case "reviews":
        return <ProviderReviews />;
      default:
        return <h1 className="text-xl">Select a section</h1>;
    }
  };

  const handleLogout = () => {
    try {
      providerLogout().then(() => {
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
          className="fixed inset-0  bg-opacity-40 z-40 lg:hidden"
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
          <h2 className="text-xl font-bold">Provider Dashboard</h2>
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="space-y-4">
          <MenuItem
            label="Orders"
            icon={<FaShoppingCart />}
            isActive={activeMenu === "orders"}
            onClick={() => setActiveMenu("orders")}
          />
          <MenuItem
            label="Services"
            icon={<FaTools />}
            isActive={activeMenu === "services"}
            onClick={() => setActiveMenu("services")}
          />
          <MenuItem
            label="Reviews"
            icon={<FaComment />}
            isActive={activeMenu === "reviews"}
            onClick={() => setActiveMenu("reviews")}
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
          <button
            className="lg:hidden text-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={24} />
          </button>
        </div>

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

export default ProviderDashboard;
