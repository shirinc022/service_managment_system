import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaStar, FaComment } from "react-icons/fa";
import { providerGetReviews } from "../services/userservices";

function ProviderReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    providerGetReviews()
      .then((res) => {
        setReviews(res.data.reviews);
      })
      .catch((err) => {
        console.log(err);
        
      });
  }, []);

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <div className="bg-base-100 shadow-xl rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaComment className="w-6 h-6" /> Customer Reviews
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review._id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                <div className="mb-2">
                  <p className="text-md font-bold text-primary">{review.service_id?.title || "Service Title Unavailable"}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <p className="text-sm font-semibold">{review.customer_id?.name}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.star ? "text-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No reviews available.</p>
        )}
      </div>
    </div>
  );
}

export default ProviderReviews;
