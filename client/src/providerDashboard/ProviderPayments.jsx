import React from 'react'
import { useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { getProviderPayments } from "../services/userservices";

function ProviderPayments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
      getProviderPayments()
        .then((res) => {
          console.log(res.data);
          setPayments(res.data.bills); // Assuming API returns { bills: [...] }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  return (
    <div className="overflow-x-auto p-4">
    <div className="bg-base-100 shadow-xl rounded-xl p-4 min-w-max">
      <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
        <FaMoneyBillWave className="w-6 h-6" /> Provider Payment Details
      </h2>
      <table className="table w-full border border-base-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Service</th>
            <th className="p-4 text-left">Total Amount</th>
            <th className="p-4 text-left">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id} className="hover:bg-primary/10 border-b border-base-300">
              <td className="p-4">{index + 1}</td>
              <td className="p-4 font-semibold text-base-content">
                {payment.customer_id?.name || "N/A"}
              </td>
              <td className="p-4">{payment.order_id?.title || "N/A"}</td>
              <td className="p-4 font-bold text-green-600">₹ {payment.totalPrice.toFixed(2)}</td>
              <td className="p-4">
                <span
                  className={`badge ${
                    payment.paymentStatus === "Paid" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {payment.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ProviderPayments
