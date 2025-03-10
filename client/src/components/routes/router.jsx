import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Userlayout from '../Layout/UserLayout'
import Home from '../pages/Home'
import Services from '../pages/Services';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CustomerDashboard from '../../customerDashboard/CustomerDashboard';
import ProviderDashboard from '../../providerDashboard/ProviderDashboard';
import AdminDashboard from '../../adminDashboard/AdminDashboard';

export const router  = createBrowserRouter([
        {
          path: "/",
          element: <Userlayout/>,
          children: [
            {
              path: "",
              element: <Home/>,
            },{
              path: "services",
              element: <Services/>,
            },{
              path: "login",
              element: <Login/>,
            },{
              path: "signup",
              element: <Signup/>,
            },
            {
              path: "signup",
              element: <Signup/>,
            },
            {
              path: "customer-dashboard",
              element: <CustomerDashboard/>,
            },
            {
              path: "provider-dashboard",
              element: <ProviderDashboard/>,
            },
            {
              path: "admin-dashboard",
              element: <AdminDashboard/>,
            },
           
          ],
        },
      ]);






