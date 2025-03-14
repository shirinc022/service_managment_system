import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { providerAcceptOrder, providerAllOrders, providerCompletedOrder, providerRejectOrder } from "../services/userservices";
import { toast } from "react-toastify";

export default function ProviderOrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    providerAllOrders()
      .then((res) => {
        setOrders(res.data.orders);
        console.log(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAccept = (orderId) => {
    providerAcceptOrder(orderId).then((res)=>{
        console.log(res.data.message);
        toast.success(res.data.message)
      
         setOrders(orders.map((order) =>
      order._id === orderId ? { ...order, status: "Accepted" } : order
    ));
           
    }).catch ((error)=> {
        console.log("error");
      })
   
  };

  const handleReject = (orderId) => {
    providerRejectOrder(orderId).then((res)=>{
        console.log(res.data.message);
        toast.error(res.data.message)
        setOrders(orders.map((order) =>
            order._id === orderId ? { ...order, status: "Rejected" } : order
          ));

    }).catch ((error)=> {
        console.log("error");
      })
   
  };

  const handleComplete = (orderId) => {
    providerCompletedOrder(orderId).then((res)=>{
        console.log(res.data.message);
        toast.success(res.data.message)
        setOrders(orders.map((order) =>
            order._id === orderId ? { ...order, status: "Completed" } : order
          ));

    }).catch ((error)=> {
        console.log("error");
      })
    // setOrders(orders.map((order) =>
    //   order.id === orderId ? { ...order, status: "Completed" } : order
    // ));
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="bg-base-100 shadow-xl rounded-xl p-4 min-w-max">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaMapMarkerAlt className="w-6 h-6" /> Provider Orders
        </h2>
        <table className="table-auto w-full border border-base-300 rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-2 w-10 text-left">#</th>
              <th className="p-2 w-25 text-left">Service Name</th>
              <th className="p-2 w-25 text-left">Customer</th>
              {/* <th className="p-4 w-35 text-left">Order Date</th> */}
              <th className="p-2 w-40 text-left">Address</th>
              <th className="p-2 w-25 text-left">Status</th>
              <th className="p-2 w-25 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-primary/10 border-b border-base-300">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-semibold text-base-content">{order.service_id?.title}</td>
                <td className="p-2 font-semibold text-base-content">{order.customer_id?.name}</td>
                {/* <td className="p-4 text-gray-500">{order.order_date}</td> */}
                <td className="p-2 ">{order.customer_name} <br /> {order.customer_phone}  <br /> {order.customer_address}<br /> {order.customer_location}</td>
                <td className="p-2">
                  <button className={`font-bold badge ${order.status === "Completed" ? "badge-success" : order.status === "Rejected" ? "badge-error" : "badge-warning"}`}>
                    {order.status}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  {order.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(order._id)}
                        className="btn btn-primary btn-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order._id)}
                        className="btn btn-error btn-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button
                      onClick={() => handleComplete(order._id)}
                      className="btn btn-success btn-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
