const adminDb = require("../models/adminModel");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const providerModel = require("../models/providerModel");
const { createToken } = require("../utils/generateToken");
const { hashpassword, comparePassword } = require("../utils/passwordUtil");

const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    const alreadyExist = await adminDb.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "Email already exist." });
    }
    const hashedPassword = await hashpassword(password);
    const newAdmin = new adminDb({
      name,
      email,
      password: hashedPassword,
    });
    const saved = await newAdmin.save();
    if (saved) {
      return res
        .status(201)
        .json({ message: "Admin created successfully.", saved });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the fields." });
    }
    const adminExist = await adminDb.findOne({ email });
    if (!adminExist) {
      return res.status(400).json({ error: "user not found" });
    }
    const passwordMatch = await comparePassword(password, adminExist.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = createToken(adminExist._id, "admin");
    res.cookie("admin_token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Cookie is sent over HTTPS only in production
      sameSite: "None", // Allows cookies to be sent across domains
    });
    // res.cookie("Admin_token", token);
    res
      .status(200)
      .json({ message: "Admin login successful", user: adminExist });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Cookie is sent over HTTPS only in production
      sameSite: "None", // Allows cookies to be sent across domains
    });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminVerifyProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const providerExist = await providerModel.findByIdAndUpdate(
      providerId,
      { verification_status: "Verified" },
      { new: true }
    );
    if (!providerExist) {
      return res.status(400).json({ error: "provider not found" });
    }
    res.status(200).json({ message: "provider verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminRejectProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const providerExist = await providerModel.findByIdAndUpdate(
      providerId,
      { verification_status: "Rejected" },
      { new: true }
    );
    if (!providerExist) {
      return res.status(400).json({ error: "provider not found" });
    }
    res.status(200).json({ message: "provider Rejected successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminDeleteProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Find and delete the provider
    const deletedProvider = await providerModel.findByIdAndDelete(providerId);

    if (!deletedProvider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const adminDeleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Find and delete the customer
    const deletedCustomer = await customerModel.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();
    if (!customers) {
      return res.status(400).json({ error: "customers not found" });
    }
    res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await providerModel.find();
    if (!providers) {
      return res.status(400).json({ error: "providers not found" });
    }
    res.status(200).json(providers);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const getOrdersView = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("Provider_id customer_id service_id");
    if (!orders) {
      return res.status(400).json({ error: "orders not found" });
    }
    res.status(200).json(orders);
    console.log(orders);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await adminDb.findById(req.admin).select("-password");
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedAdmin = await adminDb.findByIdAndUpdate(
      req.admin,
      { name },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully.", updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await hashpassword(newPassword);
    await adminDb.findByIdAndUpdate(req.admin, { password: hashedPassword });
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

const getAdminReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find()
      .populate("customer_id", "name")
      .populate("service_id", "title");
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  adminVerifyProvider,
  adminDeleteCustomer,
  getCustomers,
  getProviders,
  getOrdersView,
  adminRejectProvider,
  adminDeleteProvider,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAdminReviews,
};
