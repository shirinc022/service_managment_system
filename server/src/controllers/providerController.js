const orderModel = require("../models/orderModel");
const providerDb = require("../models/providerModel");
const serviceModel = require("../models/serviceModel");
const { createToken, createProviderToken } = require("../utils/generateToken");
const { uploadToCloudinary, uploadSinglefileToCloudinary } = require("../utils/imageUpload");
const { hashpassword, comparePassword } = require("../utils/passwordUtil");

const providerRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log(req.file);
    console.log(req.body);
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "verification document required" });
    }
    const alreadyExist = await providerDb.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "Email already exist." });
    }

    const hashedPassword = await hashpassword(password);
    const cloudinaryRes = await uploadSinglefileToCloudinary(req.file.path);
    
    console.log(cloudinaryRes, "image uploaded to cloudinary");
    const newProvider = new providerDb({
      name,
      email,
      password: hashedPassword,
      phone,
      document: cloudinaryRes,
    });
    const saved = await newProvider.save();
    if (saved) {
      return res
        .status(201)
        .json({ message: "Provider created successfully.", saved });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    const providerExist = await providerDb.findOne({ email });
    if (!providerExist) {
      return res.status(400).json({ message: "Provider not found" });
    }
    const passwordMatch = await comparePassword(
      password,
      providerExist.password
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const verified=providerExist.verification_status
    
    const token = createProviderToken(providerExist._id, "provider",verified);
    res.cookie("provider_token", token);
  
    res
      .status(200)
      .json({ message: "Provider login successful", user:providerExist });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const providerLogout = async (req, res) => {
  try {
    res.clearCookie("provider_token");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

//service CRUD

const serviceAdd = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      price,
      availability,
      service_area,
      provider_id,
    } = req.body;
    console.log(req.body);
    const images = req.files;
    console.log(images);
    if (
      !title ||
      !category ||
      !description ||
      !price ||
      !availability ||
      !service_area
    ) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    if (!req.files) {
      return res.status(400).json({ error: "images required" });
    }
    // Extract file paths from req.files
    const filePaths = req.files.map((file) => file.path);

    // Upload images to Cloudinary
    const cloudinaryRes = await uploadToCloudinary(filePaths);
    console.log("Cloudinary response:", cloudinaryRes);

    const newService = new serviceModel({
      provider_id,
      title,
      category,
      description,
      price,
      availability,
      service_area,
      images: cloudinaryRes,
    });
    const saved = await newService.save();
    if (saved) {
      return res
        .status(201)
        .json({ message: "service created successfully.", saved });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const serviceUpdate = async (req, res) => {
  try {
    console.log(req.params);

    const serviceId = req.params.id;
    console.log(serviceId);

    const service = await serviceModel.findByIdAndUpdate(serviceId, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Service updated successfully", service });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const serviceView = async (req, res) => {
  try {
    console.log(req.params);

    const serviceId = req.params.id;
    console.log(serviceId);

    const service = await serviceModel.findById(serviceId);
    return res.status(200).json({ message: "Service view by ID", service });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const serviceDelete = async (req, res) => {
  try {
    console.log(req.params);

    const serviceId = req.params.id;
    console.log(serviceId);

    const service = await serviceModel.findByIdAndDelete(serviceId);
    return res.status(200).json({ message: "Service Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};





const getServices = async (req, res) => {
  try {
    // Find services and populate the provider_id, reviews, and customer details within reviews
    const services = await serviceModel
      .find()
      .populate("provider_id")  // Populate the provider details for each service
      // .populate("reviews");

    // Return the services with the populated data
    return res.status(200).json({ message: "Listed All Services", services });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};









module.exports = {
  providerRegister,
  providerLogin,
  providerLogout,
  serviceAdd,
  serviceUpdate,
  serviceView,
  serviceDelete,
  getServices
};
