import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import {
  providerAcceptOrder,
  providerAllOrders,
  providerBillGeneration,
  providerBillsent,
  providerCompletedOrder,
  providerRejectOrder,
} from "../services/userservices";
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
        console.log("error");
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bill, setBill] = useState({
    basicAmount: "",
    materialCost: "",
    extraCharges: "",
    description: "",
    totalPrice: 0,
  });

  const openBillModal = (order) => {
    setSelectedOrder(order);
    setBill({
      basicAmount: order.price,
      materialCost: "",
      extraCharges: "",
      description: "",
      totalPrice: 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    const updatedBill = { ...bill, [name]: value };
    const total =
      Number(updatedBill.basicAmount) +
      Number(updatedBill.materialCost) +
      Number(updatedBill.extraCharges);
    updatedBill.totalPrice = total;
    setBill(updatedBill);
  };

  const handleSubmitBill = () => {
    console.log(selectedOrder._id);
    providerBillGeneration(selectedOrder._id, bill)
      .then((res) => {
        console.log(res.data.message);
        toast.success("Bill sent successfully");
        closeModal();
        providerBillsent(selectedOrder._id)
          .then((res) => {
            console.log(res);
            setOrders(
              orders.map((order) =>
                order._id === selectedOrder._id
                  ? { ...order, status: "Bill Sent" }
                  : order
              )
            );
          })
          .catch((error) => {
            console.log("error", error);
          });
      })
      .catch((error) => {
        console.log("error", error);
      });
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
              <tr key={order._id} className="hover:bg-primary/10 border-b border-base-300">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-semibold text-base-content">{order.service_id?.title}</td>
                <td className="p-2 font-semibold text-base-content">{order.customer_id?.name}</td>
                <td className="p-2">
                  {order.customer_name} <br /> {order.customer_phone} <br /> {order.customer_address}<br /> {order.customer_location}
                </td>
                <td className="p-2">
                  <button className={`font-bold badge ${order.payment === "Paid" ? "badge-success" : "badge-warning"}`}>
                    {order.payment}
                  </button>
                </td>
                <td className="p-2">
                  <button className={`font-bold badge ${order.status === "Completed" ? "badge-success" : order.status === "Rejected" ? "badge-error" : "badge-warning"}`}>
                    {order.status}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  {order.status === "Pending" && (
                    <>
                      <button onClick={() => handleAccept(order._id)} className="btn btn-success btn-sm">Accept</button>
                      <button onClick={() => handleReject(order._id)} className="btn btn-error btn-sm">Reject</button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button onClick={() => handleComplete(order._id)} className="btn btn-warning btn-sm">Mark as Complete</button>
                  )}
                  {order.payment === "Paid" ? (
                    <button className="btn btn-success btn-sm">Payment Received</button>
                  ) : order.status === "Completed" ? (
                    <button onClick={() => openBillModal(order)} className="btn btn-info btn-sm">Send Bill</button>
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
