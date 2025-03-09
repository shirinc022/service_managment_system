
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { adminLogin, providerLogin, customerLogin } from '../../services/userservices';
import { saveUser } from '../../redux/Slices/userSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [values, setValues] = useState({
        email: "",
        password: "",
        userType: "customer" // default user type
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!values.email) {
            newErrors.email = 'Email is required';
        }
        if (!values.password) {
            newErrors.password = 'Password is required';
        }
        if (!values.userType) {
            newErrors.userType = 'User type is required';
        }
        return newErrors;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            let loginFunction;
            switch (values.userType) {
                case 'admin':
                    loginFunction = adminLogin;
                    break;
                case 'provider':
                    loginFunction = providerLogin;
                    break;
                case 'customer':
                    loginFunction = customerLogin;
                    break;
                default:
                    toast.error('Invalid user type');
                    return;
            }
            loginFunction(values).then((res) => {
                console.log(res.data.user);
                toast.success('Login Successful');
                dispatch(saveUser(res.data.user));
                switch (values.userType) {
                  case 'admin':
                      navigate('/admin-dashboard');
                      break;
                  case 'provider':
                      navigate('/provider-dashboard');
                      break;
                  case 'customer':
                      navigate('/customer-dashboard');
                      break;
                  default:
                      navigate('/');
                      break;
              }
              
            }).catch((err) => {
                console.log(err);
                toast.error(err.response.data.error, {
                    position: 'top-center'
                });
            });
            console.log(values);
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <div className="hero">
            <div className="hero-content flex-col lg:flex-row-reverse">
                
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <fieldset className="fieldset">
                                <label className="fieldset-label">User Type</label>
                                <select
                                    className="input"
                                    name="userType"
                                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                >
                                  <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                    <option value="provider">Provider</option>
                                    
                                </select>
                                {errors.userType && <div className="error text-red-600">{errors.userType}</div>}
                                <label className="fieldset-label">Email</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="Email"
                                    name="email"
                                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                />
                                {errors.email && <div className="error text-red-600">{errors.email}</div>}
                                <label className="fieldset-label">Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Password"
                                    name="password"
                                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                />
                                {errors.password && <div className="error text-red-600">{errors.password}</div>}
                                {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                                <button className="btn btn-neutral mt-4" type="submit" >Login</button>
                            </fieldset>
                        </form>
                        <div className="text-center">Don't have an Account? <Link to="/signup" className="text-blue-500 underline">Sign Up</Link></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
