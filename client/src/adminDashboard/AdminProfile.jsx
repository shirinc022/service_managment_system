import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  adminGetProfile,
  adminChangePassword,
  adminUpdateProfile,
} from "../services/userservices";

function AdminProfile() {
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    adminGetProfile()
      .then((res) => {
        setAdmin(res.data.admin);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load profile");
      });
  }, []);

  const handleUpdate = () => {
    adminUpdateProfile(admin)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Update failed");
      });
  };

  const handleChangePassword = () => {
    adminChangePassword({ newPassword })
      .then((res) => {
        toast.success(res.data.message);
        setNewPassword("");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Password change failed");
      });
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <div className="bg-base-100 shadow-xl rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-primary text-center mb-4">
          Admin Profile
        </h2>

        <div className="space-y-4">
          <label className="block">
            <span className="font-semibold">Name:</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={admin.name}
              onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="font-semibold">Email:</span>
            <input
              type="email"
              className="input input-bordered w-full"
              value={admin.email}
              disabled
            />
          </label>
          <button onClick={handleUpdate} className="btn btn-primary w-full">
            Update Profile
          </button>

          <hr />

          <label className="block">
            <span className="font-semibold">New Password:</span>
            <input
              type="password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button
            onClick={handleChangePassword}
            className="btn btn-warning w-full"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
