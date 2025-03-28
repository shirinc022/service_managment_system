import React, { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaUser, FaSignOutAlt, FaHome, FaChevronRight ,FaComment} from "react-icons/fa";
import { customerLogout } from "../services/userservices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/Slices/userSlice";
import { persistor } from "../redux/store";
import CustomerOrdersTable from "./CustomerOrdersTable";
import CustomerReviews from "./CustomerReviews";
import CustomerProfile from "./CustomerProfile";
import CustomerPayments from "./CustomerPayments";

function CustomerDashboard() {
  const [activeMenu, setActiveMenu] = useState("orders");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Define breadcrumb mapping
  const breadcrumbMap = {
    orders: "Orders",
    reviews: "Reviews",
    payments: "Payments",
    profile: "Profile",
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "orders":
        return <CustomerOrdersTable />;
      case "reviews":
        return <CustomerReviews />;
      case "payments":
        return <CustomerPayments />;
      case "profile":
        return <CustomerProfile />;
      default:
        return <h1 className="text-xl">Select a section</h1>;
    }
  };

  const handleLogout = () => {
    try {
      customerLogout().then(() => {
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
        <h2 className="text-xl font-bold mb-6 text-center">Customer Dashboard</h2>
        <ul className="space-y-4">
          <MenuItem label="Orders" icon={<FaShoppingCart />} isActive={activeMenu === "orders"} onClick={() => setActiveMenu("orders")} />
          <MenuItem label="Reviews" icon={<FaComment />} isActive={activeMenu === "reviews"} onClick={() => setActiveMenu("reviews")} />
          <MenuItem label="Payments" icon={<FaCreditCard />} isActive={activeMenu === "payments"} onClick={() => setActiveMenu("payments")} />
          <MenuItem label="Profile" icon={<FaUser />} isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          <MenuItem label="Logout" icon={<FaSignOutAlt />} isActive={false} onClick={handleLogout} isLogout />
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <FaHome className="text-blue-500" />
          <span className="mx-2"><FaChevronRight /></span>
          <span className="text-blue-500 font-semibold">Dashboard</span>
          <span className="mx-2"><FaChevronRight /></span>
          <span className="text-gray-900 font-semibold">{breadcrumbMap[activeMenu]}</span>
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



export default CustomerDashboard;
