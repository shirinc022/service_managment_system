import { useEffect, useState } from "react";
import { FaPhone, FaTrash, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { customerAllOrder, customerDeleteOrder } from "../services/userservices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CustomerOrdersTable() {
  const [orders, setOrders] = useState([]);
  // console.log(orders.billStatus)
  const navigate = useNavigate()

  useEffect(() => {
    customerAllOrder()
      .then((res) => {
        setOrders(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (orderId) => {
    customerDeleteOrder(orderId)
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);
        setOrders(orders.filter((order) => order._id !== orderId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <div className="bg-base-100 shadow-xl rounded-xl p-4 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaUser className="w-6 h-6" /> My Orders
        </h2>

        {/* Make the table container scrollable on smaller screens */}
        <div className="overflow-x-auto">
          <table className="table w-full border border-base-300 rounded-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Provider</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-primary/10 border-b border-base-300">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-semibold">{order.Provider_id?.name}</td>
                  <td className="p-4 font-semibold">{order.service_id?.title}</td>
                  <td className="p-4">
                    <FaMapMarkerAlt className="inline-block text-red-500 mr-1" />
                    {order.customer_name} <br /> {order.customer_phone} <br /> {order.customer_address} <br /> {order.customer_location}
                  </td>
                  <td className="p-4">
                    <span className={`badge ${order.status === "Accepted" ? "badge-success" : "badge-warning"} font-bold`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status === "Pending" ? (
                      <button onClick={() => handleDelete(order._id)} className="btn btn-error btn-sm flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    ) : order.status === "Accepted" ? (
                      <button className="btn btn-primary btn-sm flex items-center gap-1">
                        <FaPhone /> Contact
                      </button>
                    ) :order.status === "Completed" && order.billStatus === "Bill sent" ?(
                      <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={()=>navigate(`/bill/${order._id}` )}>
                         Pay Bill Now
                      </button>
                    ): (
                      <span className="text-gray-500">No Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add bottom margin to avoid footer overlap */}
      <div className="mt-10"></div>
    </div>
  );
}
