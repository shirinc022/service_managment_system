import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { customerOrderRequest, listSingleService, listSingleServiceReview } from "../../services/userservices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // State for service details and reviews
  const [serviceData, setServiceData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    async function fetchServiceData() {
      try {
        const serviceResponse = await listSingleService(serviceId);
        const reviewResponse = await listSingleServiceReview(serviceId);

        setServiceData(serviceResponse.data.service);
        setReviews(reviewResponse.data.reviews || []);
        setAverageRating(reviewResponse.data.averageRating || 0);
        setTotalReviews(reviewResponse.data.totalReviews || 0);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServiceData();
  }, [serviceId]);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await customerOrderRequest(serviceId, formData);
      toast.success(res.data.message);
      navigate('/customer-dashboard');
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to book service. Please Login before booking");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-red-500 text-lg font-semibold">Loading service details...</div>;
  }

  if (!serviceData) {
    return <div className="text-center py-10 text-gray-500 text-lg font-semibold">Service not found.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Image Carousel */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <Carousel showThumbs={false} autoPlay infiniteLoop className="rounded-xl">
          {serviceData.images?.map((img, index) => (
            <div key={index} className="h-[350px] md:h-[400px] lg:h-[450px] w-full">
              <img src={img} alt={`Service ${index}`} className="rounded-xl w-full h-full object-cover" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Service Details */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">{serviceData.title}</h1>
        <p className="text-gray-500 text-lg mt-1">
          Provided by <span className="text-primary font-semibold">{serviceData.provider_id?.name || "Unknown"}</span>
        </p>

        {/* Ratings */}
        <div className="flex items-center mt-3">
          {[...Array(5)].map((_, i) =>
            i < Math.round(averageRating) ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-400" />
          )}
          <span className="ml-2 text-gray-600 text-sm">({totalReviews} reviews)</span>
        </div>

        {/* Service Information */}
        <div className="mt-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Service Area:</h2>
          <p className="text-gray-600">{serviceData.service_area}</p>

          <h2 className="text-lg font-semibold text-gray-700">Availability:</h2>
          <p className="text-gray-600">{serviceData.availability}</p>

          <h2 className="text-lg font-semibold text-gray-700">Description:</h2>
          <p className="text-gray-600 leading-relaxed">{serviceData.description}</p>
        </div>

        <p className="text-2xl font-semibold mt-5 text-primary">₹ {serviceData.price}</p>

        {/* Book Now Button */}
        <button className="btn btn-primary w-full mt-6 text-lg py-3 rounded-lg shadow-lg" onClick={() => document.getElementById("bookingModal").showModal()}>
          Book Now
        </button>
      </div>

      {/* Customer Reviews */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b last:border-none py-4 flex items-start gap-3">
              <FaUserCircle className="text-4xl text-gray-500" />
              <div>
                <p className="font-semibold text-lg">{review.customer_id?.name || "Anonymous"}</p>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) =>
                    i < review.star ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>
                <p className="text-gray-600">{review.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Booking Modal */}
      <dialog id="bookingModal" className="modal">
        <div className="modal-box w-96 p-6 bg-base-100">
          <h2 className="text-xl font-bold mb-4 text-center text-primary">Book a Service</h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {["customer_name", "customer_phone", "customer_address", "customer_location"].map((field, index) => (
              <label key={index} className="block">
                <span className="text-base font-semibold">{field.replace("_", " ")}</span>
                <input 
                  type="text" 
                  name={field}
                  required
                  className="input input-bordered w-full mt-1" 
                  value={formData[field]} 
                  onChange={handleChange} 
                />
              </label>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn btn-error" onClick={() => document.getElementById("bookingModal").close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default ServiceDetailPage;
