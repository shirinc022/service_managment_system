import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();

  // Function to render stars dynamically based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };

  return (
    <div>
      <div className="card bg-base-100 shadow-xl border border-gray-200">
        <figure>
          <div className="h-48 w-full">
            <img
              src={service.images[0]}
              className="w-full h-full object-cover"
              alt={service.title}
            />
          </div>
        </figure>
        <div className="card-body">
          <h2 className="card-title h-6 w-3/4">{service.title}</h2>
          <p className="text-gray-600">By {service.provider_id?.name}</p>

          {/* Display Average Rating and Total Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(service.averageRating || 0)}</div>
            <span className="text-gray-500 text-sm">
              {service.totalReviews || 0} reviews
            </span>
          </div>

          {/* Price */}
          <p className="font-semibold text-lg text-blue-600">${service.price}</p>

          {/* Action Button */}
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate(`/service-detail/${service._id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
