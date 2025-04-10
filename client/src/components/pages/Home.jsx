import React from "react";
import { Link } from "react-router-dom";
import { FaWrench, FaBroom, FaBolt } from "react-icons/fa";

function Home() {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Hero Section */}
      <div
        className="hero min-h-screen w-full !p-0"
        style={{
          backgroundImage:
            "url(https://intownplumbingtx.com/wp-content/uploads/2024/03/what-to-know-about-plumbing-tools-web-img.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to Our Services</h1>
            <p className="mb-5">
              Discover top-notch solutions tailored for your needs. Reliable and
              professional services at your fingertips.
            </p>
            <Link to="/services" className="btn btn-primary">
              Get Services
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-10 text-center bg-base-200">
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="text-lg max-w-3xl mx-auto">
          We are committed to delivering the best services to our customers. Our
          team of experts ensures quality and satisfaction at every step.
        </p>
      </div>

      {/* Services Preview Section */}
      <div className="p-10 text-center bg-base-100">
        <h2 className="text-4xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-200 shadow-xl p-5 flex items-center">
            <FaWrench className="w-12 h-12 text-primary mb-3" />
            <h3 className="text-xl font-bold">Plumbing</h3>
            <p>
              Expert plumbing services for residential and commercial needs.
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl p-5 flex items-center">
            <FaBroom className="w-12 h-12 text-primary mb-3" />
            <h3 className="text-xl font-bold">Cleaning</h3>
            <p>Professional cleaning services to keep your space spotless.</p>
          </div>
          <div className="card bg-base-200 shadow-xl p-5 flex items-center">
            <FaBolt className="w-12 h-12 text-primary mb-3" />
            <h3 className="text-xl font-bold">Electrical</h3>
            <p>Reliable electrical solutions for homes and businesses.</p>
          </div>
        </div>
        <Link to="/services" className="btn btn-primary mt-6">
          View All Services
        </Link>
      </div>
    </div>
  );
}

export default Home;
