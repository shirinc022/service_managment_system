import React, { useState } from "react";
import axios from "axios";
import { contact } from "../../services/userservices";
import { toast } from "react-toastify";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
   

    try {
        const response = await contact(formData);
       

        setStatus(response.data.message);
        toast.success(response.data.message);
        

        setFormData({ name: "", email: "", message: "" });
    } catch (error) {
        console.error("Error:", error); 
        setStatus("Error sending message");
        toast.error("Failed to send message");
       
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
      <div className="card bg-base-200 p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
        {status && <p className="text-center mt-3 text-sm">{status}</p>}
      </div>
    </div>
  );
}

export default Contact;
