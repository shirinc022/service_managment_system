import { useEffect, useState } from "react";
import { FaPhone, FaTrash, FaMapMarkerAlt, FaUser, FaStar  } from "react-icons/fa";
import { customerAllOrder, customerDeleteOrder, customerSubmitReview } from "../services/userservices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CustomerOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({}); 
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

  // const handleRating = (orderId, rating) => {
  //   setSelectedRatings({ ...selectedRatings, [orderId]: rating });
  // };

  // const handleRatingSubmit = (orderId) => {
  //   const rating = selectedRatings[orderId];
  //   console.log(`Submitting rating ${rating} for order ${orderId}`);

  //   // You can replace this with an API call to save the rating
  //   toast.success(`Thank you! You rated ${rating} stars.`);
  // };
  const handleReviewChange = (orderId, key, value) => {
    setReviews({
      ...reviews,
      [orderId]: {
        ...reviews[orderId],
        [key]: value,
      },
    });
  };

  const handleReviewSubmit = (orderId) => {
    const { star, description } = reviews[orderId] || {};
    if (!star) {
      toast.error("Please select a star rating!");
      return;
    }
  
    console.log(`Submitting review for order ${orderId}:`, { star, description });
 
      
      customerSubmitReview(orderId,{ star, description }).then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, reviewStatus: "Reviewed" } : order
        ));
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
                <th className="p-4 text-left">Payment</th>
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
                  <td className="p-4 font-semibold"> <span className={`badge ${order.payment === "Paid" ? "badge-success" : "badge-warning"} font-bold`}>{order.payment}</span> </td>
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
                    ) :order.status === "Completed" && order.billStatus === "Bill sent" && order.payment === "Pending" ?(
                      <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={()=>navigate(`/bill/${order._id}` )}>
                         Pay Bill Now
                      </button>
                    ):

                    order.reviewStatus === "Reviewed" ? (
                      <span className="text-gray-500">Reviewed</span>
                    ) : order.payment === "Paid" ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`cursor-pointer ${reviews[order._id]?.star >= star ? "text-yellow-500" : "text-gray-400"}`}
                              onClick={() => handleReviewChange(order._id, "star", star)}
                            />
                          ))}
                        </div>
                        <textarea
                          className="textarea textarea-bordered w-full mt-2"
                          placeholder="Write a short review..."
                          value={reviews[order._id]?.description || ""}
                          onChange={(e) => handleReviewChange(order._id, "description", e.target.value)}
                        />
                        <button className="btn btn-sm btn-success mt-2" onClick={() => handleReviewSubmit(order._id)}>
                          Submit Review
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No Action</span>
                    )
                    }
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
