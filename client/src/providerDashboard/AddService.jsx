import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { providerAddService } from "../services/userservices";
import { toast } from "react-toastify";

export default function AddService() {
  const navigate = useNavigate();

  const [service, setService] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    availability: "",
    service_area: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle form input change
  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...service.images, ...files];
    const newPreviews = [...imagePreviews, ...files.map((file) => URL.createObjectURL(file))];

    setService({ ...service, images: newImages });
    setImagePreviews(newPreviews);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = service.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setService({ ...service, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(service).forEach((key) => {
      if (key === "images") {
        service.images.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, service[key]);
      }
    });
    providerAddService(formData).then((res)=>{
        console.log(res.data);
        toast.success(res.data.message)
        navigate('/provider-dashboard')
      
      
        
    }).catch((err)=>{
        console.log(err);
        
    })

    
  };

  return (
   <div className="p-7">
     <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg border border-base-300 ">
      <h2 className="text-2xl font-bold text-base-content mb-4">Add New Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="label text-base-content">Title</label>
          <input
            type="text"
            name="title"
            value={service.title}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-base-200 text-base-content"
          />
        </div>

        {/* Category */}
        <div>
          <label className="label text-base-content">Category</label>
          <select
            name="category"
            value={service.category}
            onChange={handleChange}
            required
            className="select select-bordered w-full bg-base-200 text-base-content"
          >
            <option value="">Select Category</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleaning">Cleaning</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label text-base-content">Description</label>
          <textarea
            name="description"
            value={service.description}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full bg-base-200 text-base-content"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="label text-base-content">Price</label>
          <input
            type="text"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-base-200 text-base-content"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="label text-base-content">Availability</label>
          <input
            type="text"
            name="availability"
            value={service.availability}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-base-200 text-base-content"
          />
        </div>

        {/* Service Area */}
        <div>
          <label className="label text-base-content">Service Area</label>
          <input
            type="text"
            name="service_area"
            value={service.service_area}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-base-200 text-base-content"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="label text-base-content">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt="Preview" className="w-16 h-16 rounded-md border border-base-300" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  onClick={() => handleRemoveImage(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full flex items-center gap-2" >
          <FaCloudUploadAlt /> Submit Service
        </button>
      </form>
    </div>
   </div>
  );
}
