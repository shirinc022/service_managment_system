import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  adminSignup,
  customerSignup,
  customerVerified,
  providerSignup,
} from "../../services/userservices";
import { toast } from "react-toastify"; // For notifications
import { saveUser } from "../../redux/Slices/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    userType: "customer", // Default to customer
    document: "",
  });

  const [errors, setErrors] = useState({});

  // 🔹 Validate Form Fields
  const validateForm = () => {
    const newErrors = {};
    if (!values.name) newErrors.name = "Name is required";
    if (!values.email) newErrors.email = "Email is required";
    if (!values.phone) newErrors.phone = "Phone is required";
    if (!values.password) newErrors.password = "Password is required";
    if (!values.userType) newErrors.userType = "User type is required";
    if (values.userType === "provider" && !values.document) {
      newErrors.document = "Document is required for providers";
    }
    return newErrors;
  };

  // 🔹 Handle Form Submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let signupFunction;
    switch (values.userType) {
      case "admin":
        signupFunction = adminSignup;
        break;
      case "provider":
        signupFunction = providerSignup;
        break;
      case "customer":
        signupFunction = customerSignup;
        break;
      default:
        toast.error("Invalid user type");
        return;
    }

    let requestData;
    let config = {}; // Needed for headers in provider signup

    if (values.userType === "provider") {
      // Use FormData for providers
      requestData = new FormData();
      requestData.append("name", values.name);
      requestData.append("email", values.email);
      requestData.append("phone", values.phone);
      requestData.append("password", values.password);
      requestData.append("userType", values.userType);
      requestData.append("document", values.document);

      // Ensure headers are set for file uploads
      config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
    } else {
      // ✅ Send normal JSON for customers & admins
      requestData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userType: values.userType,
      };
    }

    signupFunction(requestData, config) // Send requestData with config
      .then((res) => {
        console.log(res);

        console.log(res.data.message);
        toast.success(res.data.message);
        const token = res.data.token;
        if (values.userType === "customer") {
          navigate("/check-email");
        } else {
          dispatch(saveUser(res.data.user));
          navigate("/login"); // Redirect admin & provider to login
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.error || "Signup failed", {
          position: "top-center",
        });
      });
  };

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <fieldset className="fieldset">
                <label className="fieldset-label">User Type</label>
                <select
                  className="input"
                  name="userType"
                  value={values.userType}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="provider">Provider</option>
                </select>
                {errors.userType && <p className="error">{errors.userType}</p>}

                <label className="fieldset-label">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
                {errors.name && <p className="error">{errors.name}</p>}

                <label className="fieldset-label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label className="fieldset-label">Phone number</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="Phone number"
                  name="phone"
                  value={values.phone}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
                {errors.phone && <p className="error">{errors.phone}</p>}

                <label className="fieldset-label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
                {errors.password && <p className="error">{errors.password}</p>}

                {/* Document Upload (For Providers Only) */}
                {values.userType === "provider" && (
                  <>
                    <label className="fieldset-label">
                      Upload Verification Document
                    </label>
                    <input
                      type="file"
                      className="input"
                      accept=".jpg,.jpeg,.png"
                      name="document"
                      onChange={(e) =>
                        setValues({ ...values, document: e.target.files[0] })
                      }
                    />
                    {errors.document && (
                      <p className="error">{errors.document}</p>
                    )}
                  </>
                )}

                <button className="btn btn-neutral mt-4" type="submit">
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
          <div className="text-center">
            Already have an Account?
            <Link to={"/login"} className="text-blue-500 underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
