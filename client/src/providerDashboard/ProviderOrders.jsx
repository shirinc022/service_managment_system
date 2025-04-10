import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import {
  providerAcceptOrder,
  providerAllOrders,
  providerCompletedOrder,
  providerRejectOrder,
} from "../services/userservices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProviderOrdersTable() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
    providerAcceptOrder(orderId)
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);

        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "Accepted" } : order
          )
        );
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const handleReject = (orderId) => {
    providerRejectOrder(orderId)
      .then((res) => {
        console.log(res.data.message);
        toast.error(res.data.message);
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "Rejected" } : order
          )
        );
      })
      .catch((error) => {
        console.log("error",error);
      });
  };

  const handleComplete = (orderId) => {
    console.log(orderId);
    providerCompletedOrder(orderId)
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "Completed" } : order
          )
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const openBillPage = (order) => {
    navigate("/send-bill", { state: { order } });
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
              <th className="p-2 w-40 text-left">Address</th>
              <th className="p-2 w-40 text-left">Payment</th>
              <th className="p-2 w-25 text-left">Status</th>
              <th className="p-2 w-25 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="hover:bg-primary/10 border-b border-base-300"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-semibold text-base-content">
                  {order.service_id?.title}
                </td>
                <td className="p-2 font-semibold text-base-content">
                  {order.customer_id?.name}
                </td>
                <td className="p-2">
                  {order.customer_name} <br /> {order.customer_phone} <br />
                  {order.customer_address}
                  <br /> {order.customer_location}
                </td>
                <td className="p-2">
                  <button
                    className={`font-bold badge ${
                      order.payment === "Paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.payment}
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className={`font-bold badge ${
                      order.status === "Completed"
                        ? "badge-success"
                        : order.status === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {order.status}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  {order.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(order._id)}
                        className="btn btn-success btn-sm"
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
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleComplete(order._id)}
                        className="btn btn-warning btn-sm"
                      >
                        Mark as Complete
                      </button>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="btn btn-info btn-sm"
                      >
                        <FaPhone /> Contact
                      </a>
                    </div>
                  )}

                  {order.payment === "Paid" ? (
                    <button className="btn btn-success btn-sm">
                      Payment Received
                    </button>
                  ) : order.status === "Completed" ? (
                    order.billStatus === "Bill sent" ? (
                      <button className="btn btn-disabled btn-sm">
                        Bill Sent
                      </button>
                    ) : (
                      <button
                        onClick={() => openBillPage(order)}
                        className="btn btn-info btn-sm"
                      >
                        Send Bill
                      </button>
                    )
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
