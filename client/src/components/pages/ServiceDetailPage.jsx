import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { customerOrderRequest, listSingleService } from "../../services/userservices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ServiceDetailPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);


  

  useEffect(() => {
    listSingleService(serviceId)
      .then((res) => {
        setService(res.data.service);
        
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
     
      });
  }, [serviceId]);

// const handleRequest=(serviceId)=>{
//   customerOrderRequest(serviceId).then((res)=>{
//     console.log(res);
//     setLoading(false);
//   }) .catch((err) => {
//     console.error("Error fetching service:", err);
//     setLoading(false);
//   });
// }

const [formData, setFormData] = useState({
  customer_name: "",
  customer_phone: "",
  customer_address: "",
  customer_location: "",
});

const navigate = useNavigate(); // For redirecting to server route

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form Submitted:", formData);

  customerOrderRequest(serviceId,formData).then((res)=>{
        console.log(res.data.message);
        toast.success(res.data.message)
        navigate('/customer-dashboard')
       
      }) .catch((err) => {
        console.error("Error fetching service:", err);
        
      });

};

  const customerReviews = [
    { name: "John Doe", rating: 5, feedback: "Amazing service!", profile: "" },
    { name: "Sarah Smith", rating: 4, feedback: "Very good experience.", profile: "" },
  ];

  

  if (!service) {
    return <div className="text-center py-10 text-red-500 text-lg font-semibold">Service not found.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Image Carousel */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <Carousel showThumbs={false} autoPlay infiniteLoop className="rounded-xl">
          {service?.images.map((img, index) => (
            <div key={index} className="h-[350px] md:h-[400px] lg:h-[450px] w-full">
              <img src={img} alt={`Service ${index}`} className="rounded-xl w-full h-full object-cover" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Service Details */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">{service?.title}</h1>
        <p className="text-gray-500 text-lg mt-1">
          Provided by <span className="text-primary font-semibold">{service?.provider_id?.name || "Unknown"}</span>
        </p>

        {/* Ratings */}
        {/* <div className="flex items-center mt-3">
          {[...Array(5)].map((_, i) =>
            i < Math.round(service?.rating || 0) ? (
              <FaStar key={i} className="text-yellow-500" />
            ) : (
              <FaRegStar key={i} className="text-gray-400" />
            )
          )}
          <span className="ml-2 text-gray-600 text-sm">({service?.totalReviews || 0} reviews)</span>
        </div> */}

        {/* Service Information */}
        <div className="mt-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Service Area:</h2>
          <p className="text-gray-600">{service?.service_area}</p>

          <h2 className="text-lg font-semibold text-gray-700">Availability:</h2>
          <p className="text-gray-600">{service?.availability}</p>

          <h2 className="text-lg font-semibold text-gray-700">Description:</h2>
          <p className="text-gray-600 leading-relaxed">{service?.description}</p>
        </div>

        <p className="text-2xl font-semibold mt-5 text-primary">${service?.price}</p>

        {/* Book Now Button */}
        <button className="btn btn-primary w-full mt-6 text-lg py-3 rounded-lg shadow-lg" onClick={() => document.getElementById("bookingModal").showModal()}>Book Now</button>
      </div>

      {/* Customer Feedback */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Customer Feedback</h2>
        {customerReviews.length > 0 ? (
          customerReviews.map((review, index) => (
            <div key={index} className="border-b last:border-none py-4 flex items-start gap-3">
              <FaUserCircle className="text-4xl text-gray-500" />
              <div>
                <p className="font-semibold text-lg">{review.name}</p>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) =>
                    i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>
                <p className="text-gray-600">{review.feedback}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>


      <dialog id="bookingModal" className="modal">
        <div className="modal-box w-96 p-6 bg-base-100">
          <h2 className="text-xl font-bold mb-4 text-center text-primary">Book a Service</h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="text-base font-semibold">Name</span>
              <input 
                type="text" 
                name="customer_name"
                required
                className="input input-bordered w-full mt-1" 
                value={formData.customer_name} 
                onChange={handleChange} 
              />
            </label>

            <label className="block">
              <span className="text-base font-semibold">Phone</span>
              <input 
                type="text" 
                name="customer_phone"
                required
                className="input input-bordered w-full mt-1" 
                value={formData.customer_phone} 
                onChange={handleChange} 
              />
            </label>

            <label className="block">
              <span className="text-base font-semibold">Address</span>
              <textarea 
                name="customer_address"
                required
                className="textarea textarea-bordered w-full mt-1" 
                value={formData.customer_address} 
                onChange={handleChange} 
              ></textarea>
            </label>


            <label className="block">
              <span className="text-base font-semibold">Location</span>
              <input 
                type="text" 
                name="customer_location"
                required
                className="input input-bordered w-full mt-1" 
                value={formData.customer_location} 
                onChange={handleChange} 
              />
            </label>

           
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn btn-error" onClick={() => document.getElementById("bookingModal").close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" >Submit</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default ServiceDetailPage;
