import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import {
  providerDeleteService,
  providerGetServices,
} from "../services/userservices";
import { useNavigate } from "react-router-dom";

export default function ProviderServiceListing() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    providerGetServices()
      .then((res) => {
        console.log(res.data.services);
        setServices(res.data.services);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (serviceId) => {
    providerDeleteService(serviceId)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Your Services</h2>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate("/add-service")}
        >
          <FaPlus /> Add Service
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="card bg-base-100 shadow-xl p-6 border border-base-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Service Details */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <div className="text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />{" "}
                {service.service_area}
              </div>
              <div className="text-gray-500 flex items-center gap-2">
                <FaClock className="text-green-500" /> {service.availability}
              </div>
              <p className="text-lg font-bold text-primary mt-1">
                {service.price}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  className="btn btn-sm btn-warning flex items-center gap-2"
                  onClick={() => navigate(`/update-service/${service._id}`)}
                >
                  <FaEdit /> Update
                </button>
                <button
                  className="btn btn-sm btn-error flex items-center gap-2"
                  onClick={() => handleDelete(service._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>

            {/* Image Tiles (Right Corner) */}
            <div className="grid grid-cols-2 gap-1">
              {service.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Service Icon"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
