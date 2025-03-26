import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUser, FaKey } from "react-icons/fa";
import { getCustomerProfile, updateCustomerPassword } from "../services/userservices";


function CustomerProfile() {
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCustomerProfile()
      .then((res) => {
        setProfile(res.data.customer);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load profile");
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateCustomerPassword({ oldPassword, newPassword });
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <div className="bg-base-100 shadow-xl rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaUser className="w-6 h-6" /> My Profile
        </h2>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Name:</label>
            <p className="p-2 bg-gray-100 rounded-lg">{profile.name}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Email:</label>
            <p className="p-2 bg-gray-100 rounded-lg">{profile.email}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Change Password Form */}
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          <FaKey /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold">Old Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">New Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerProfile;
