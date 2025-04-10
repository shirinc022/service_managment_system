import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import {
  listServices,
  listSingleServiceReview,
} from "../../services/userservices";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServicesWithReviews() {
      try {
        const res = await listServices();
        let servicesData = res.data.services || [];

        // Fetch average rating and total reviews for each service
        const updatedServices = await Promise.all(
          servicesData.map(async (service) => {
            try {
              const reviewRes = await listSingleServiceReview(service._id);
              const averageRating = reviewRes.data.averageRating || 0;
              const totalReviews = reviewRes.data.totalReviews || 0;

              return { ...service, averageRating, totalReviews };
            } catch (error) {
              console.error(
                "Error fetching reviews for service:",
                service._id,
                error
              );
              return { ...service, averageRating: 0, totalReviews: 0 };
            }
          })
        );

        setServices(updatedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServicesWithReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-red-500 text-lg font-semibold">
        Loading services...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-7">
      {services.length > 0 ? (
        services.map((service, i) => (
          <ServiceCard key={service._id || i} service={service} />
        ))
      ) : (
        <div className="text-center col-span-3 text-gray-500 text-lg font-semibold">
          No services available.
        </div>
      )}
    </div>
  );
}

export default Services;
