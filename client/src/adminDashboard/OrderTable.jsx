import { useEffect, useState } from "react";
import { FaUser, FaMoneyBill, FaMapMarkerAlt } from "react-icons/fa";
import { adminGetOrders } from "../services/userservices";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminGetOrders()
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <div className="bg-base-100 shadow-xl rounded-xl p-4">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaUser className="w-6 h-6" /> Orders List
        </h2>
        <table className="table w-full border border-base-300 rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Service</th>
              <th className="p-4 text-left">Provider</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left w-45">Address</th> 
              <th className="p-4 text-left w-5">Payment</th> 
              <th className="p-4 text-left w-5">Status</th> 
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-primary/10 border-b border-base-300">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-semibold text-base-content">{order.service_id?.title}</td>
                <td className="p-4 font-semibold text-base-content">{order.Provider_id?.name}</td>
                <td className="p-4 text-gray-500">{order.customer_id.name}</td>
                <td className="p-4 flex items-center gap-2 w-45"> 
                  {/* <FaMapMarkerAlt className="text-red-500" />  */}
                  {order.customer_name} <br/>{order.customer_phone} <br/>{order.customer_address} <br/>{order.customer_location}
                </td>
                <td className="p-4 w-5"> 
                  <button className={`font-bold badge ${order.payment === "Paid" ? "badge-success" : "badge-warning"}`}>{order.payment}</button>
                </td>
                <td className="p-4 w-5">
                  <button className={`font-bold badge ${order.status === "Completed" ? "badge-success" : "badge-info"}`}>{order.status}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
