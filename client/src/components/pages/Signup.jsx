import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  adminSignup,
  customerSignup,
  providerSignup,
} from "../../services/userservices";
import { toast } from 'react-toastify'; // Assuming you have react-toastify for notifications

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: '',
    document: null // Add a field for document
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!values.name) {
      newErrors.name = "Name is required";
    }
    if (!values.email) {
      newErrors.email = "Email is required";
    }
    if (!values.phone) {
      newErrors.phone = "Phone is required";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
    }
    if (!values.userType) {
      newErrors.userType = "User type is required";
    }
    if (values.userType === 'provider' && !values.document) {
      newErrors.document = "Document is required for providers";
    }
    return newErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
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
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('password', values.password);
      formData.append('userType', values.userType);
      if (values.document) {
        formData.append('document', values.document);
      }

      signupFunction(formData)
        .then((res) => {
          console.log(res);
          toast.success("SignUp Successful");
          switch (values.userType) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "provider":
              navigate("/provider-dashboard");
              break;
            case "customer":
              navigate("/customer-dashboard");
              break;
            default:
              navigate("/");
              break;
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error, {
            position: "top-center",
          });
        });
    } else {
      setErrors(formErrors);
    }
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
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                >
                  <option value="">Select User Type</option>
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
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                {errors.name && <p className="error">{errors.name}</p>}

                <label className="fieldset-label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label className="fieldset-label">Phone number</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="Phone number"
                  name="phone"
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}

                <label className="fieldset-label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                {errors.password && <p className="error">{errors.password}</p>}

                {/* <label className="fieldset-label">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm Password"
                  name="confirmpassword"
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                /> */}

                {/* Conditionally render the document upload field */}
                {values.userType === 'provider' && (
                  <>
                    <label className="fieldset-label">Upload Document</label>
                    <input
                      type="file"
                      className="input"
                      name="document"
                      onChange={(e) => {
                        setValues({ ...values, document: e.target.files[0] });
                      }}
                    />
                    {errors.document && <p className="error">{errors.document}</p>}
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
