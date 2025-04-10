import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handledashboard = () => {
    if (userData.user.role == "customer") {
      navigate("/customer-dashboard");
    } else if (userData.user.role == "provider") {
      navigate("/provider-dashboard");
    } else if (userData.user.role == "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 text-base-content">
      <div className="bg-base-100 shadow-lg rounded-xl p-8 text-center w-96">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-lg mt-2">Thank you for your payment.</p>
        <p className="text-sm text-gray-500 mt-1">
          Your transaction was completed successfully.
        </p>

        <button
          onClick={handledashboard}
          className="btn btn-primary mt-4 w-full"
        >
          go to dashboard
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
