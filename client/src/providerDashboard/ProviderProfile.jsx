import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUser, FaKey, FaFileAlt, FaPhone, FaEdit, FaCheck } from "react-icons/fa";
import { getProviderProfile, updateProviderPassword, updateProviderPhone } from "../services/userservices";

function ProviderProfile() {
  const [profile, setProfile] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProviderProfile()
      .then((res) => {
        setProfile(res.data.provider);
        setPhone(res.data.provider.phone);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load profile");
      });
  }, []);

  // Update phone number
  const handlePhoneUpdate = async () => {
    try {
      const res = await updateProviderPhone({ phone });
      toast.success(res.data.message);
      setProfile({ ...profile, phone: res.data.phone });
      setEditingPhone(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Phone update failed");
    }
  };

  // Update password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProviderPassword({ oldPassword, newPassword });
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
          <FaUser className="w-6 h-6" /> Provider Profile
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

          {/* Editable Phone Number */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <FaPhone /> Phone:
            </label>
            {editingPhone ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button onClick={handlePhoneUpdate} className="btn btn-sm btn-success">
                  <FaCheck />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                <span>{profile.phone}</span>
                <button onClick={() => setEditingPhone(true)} className="btn btn-sm btn-warning">
                  <FaEdit />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Verification Document:</label>
            {profile.document ? (
              <a href={profile.document.secure_url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-2">
                <FaFileAlt /> View Document
              </a>
            ) : (
              <p className="p-2 bg-gray-100 rounded-lg text-red-500">No document uploaded</p>
            )}
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

export default ProviderProfile;
