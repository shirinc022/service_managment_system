import React from 'react'

import { FaStar, FaRegStar } from "react-icons/fa";

function ServiceCard({service}) {
  return (
//     <div>
//     <div className="card bg-base-100 shadow-xl border border-gray-200">
//       <figure>
//         <div className="h-48 w-full">
//           <img src={service.images[0]} className="w-full h-full object-cover" alt="" />
//         </div>
//       </figure>
//       <div className="card-body">
//         <h2 className="card-title h-6 w-3/4">{service.title}</h2>
//         <p className="h-4 w-1/2 rounded">{service.provider_id.name}</p>
//         <div className="flex items-center gap-2">
//           <div className="rating rating-sm">
//             {/* Render filled and empty stars based on the service rating */}
//             {[...Array(5)].map((_, i) => (
//               <input
//                 key={i}
//                 type="radio"
//                 className={`mask mask-star-2 ${i < 4 ? 'bg-yellow-300' : 'bg-gray-300'}`}
                
//               />
//             ))}
//           </div>
//           <span>4 reviews</span> {/* Display review count */}
//         </div>
//         <p>{service.price}</p>
//         <div className="card-actions justify-end">
//           <button className="btn btn-primary w-full">View Details</button>
//         </div>
//       </div>
//     </div>
//   </div>

<div>
  <div className="card bg-base-100 shadow-xl border border-gray-200">
    <figure>
      <div className="h-48 w-full">
        <img src={service.images[0]} className="w-full h-full object-cover" alt="" />
      </div>
    </figure>
    <div className="card-body">
      <h2 className="card-title h-6 w-3/4">{service.title}</h2>
      <p>{service.provider_id.name}</p>

      {/* Render Rating using FontAwesome */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {/* Render filled and empty stars based on the service rating */}
          {[...Array(5)].map((_, i) => (
            i < 4 ? (
              <FaStar key={i} className="text-yellow-500" />
            ) : (
              <FaRegStar key={i} className="text-gray-400" />
            )
          ))}
        </div>
        <span>4 reviews</span> {/* Display dynamic review count */}
      </div>

      {/* Price */}
      <p>{service.price}</p>

      {/* Action Button */}
      <div className="card-actions justify-end">
        <button className="btn btn-primary w-full">View Details</button>
      </div>
    </div>
  </div>
</div>


  
  )
}

export default ServiceCard
