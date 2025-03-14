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
      return res.status(400).json({ error: "Please enter all fields." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "verification document required" });
    }
    const alreadyExist = await providerDb.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ error: "Email already exist." });
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
      return res.status(400).json({ error: "Please fill all the fields." });
    }
    const providerExist = await providerDb.findOne({ email });
    if (!providerExist) {
      return res.status(400).json({ error: "Provider not found" });
    }
    const passwordMatch = await comparePassword(
      password,
      providerExist.password
    );

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const verified=providerExist.verification_status
    
    const token = createProviderToken(providerExist._id, "provider",verified);
    res.cookie("provider_token", token,{
      httpOnly: true,       // Prevents client-side access to the cookie
      secure: true, // Cookie is sent over HTTPS only in production
      sameSite: 'None',     // Allows cookies to be sent across domains
    });
  
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
    const providerId=req.provider
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
      provider_id:providerId,
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
    const { serviceId } = req.params;
    const { removeImages } = req.body; // Get images to be removed

    console.log("Received Data:", req.body);
    console.log("Received Files:", req.files);
    console.log("serviceId:", serviceId);

    // Find the existing service
    const existingService = await serviceModel.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ error: "Service not found" });
    }

    let updatedImages = existingService.images; // Keep existing images

    // Remove selected images from Cloudinary & database
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      updatedImages = updatedImages.filter((img) => !imagesToRemove.includes(img));

      // Delete images from Cloudinary
      // for (let img of imagesToRemove) {
      //   await deleteFromCloudinary(img); // Assuming this function exists
      // }
    }

    // Append new uploaded images
    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map((file) => file.path);
      const cloudinaryRes = await uploadToCloudinary(filePaths);
      updatedImages = [...updatedImages, ...cloudinaryRes];
    }

    // Update only provided fields
    const updatedData = {
      title: req.body.title || existingService.title,
      category: req.body.category || existingService.category,
      description: req.body.description || existingService.description,
      price: req.body.price || existingService.price,
      availability: req.body.availability || existingService.availability,
      service_area: req.body.service_area || existingService.service_area,
      images: updatedImages,
    };

    // Update the service in the database
    const updatedService = await serviceModel.findByIdAndUpdate(
      serviceId,
      updatedData,
      { new: true, runValidators: true }
    );

    console.log("Updated Service:", updatedService);
    return res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};






// const serviceUpdate = async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     console.log("Received Data:", req.body);
//     console.log("Received Files:", req.files);
//     console.log("serviceId", serviceId)

//     // Check if service ID is valid
//     // if (!mongoose.Types.ObjectId.isValid(serviceId)) {
//     //   return res.status(400).json({ error: "Invalid service ID" });
//     // }

//     // Find the existing service
//     const existingService = await serviceModel.findById(serviceId);
//     if (!existingService) {
//       return res.status(404).json({ error: "Service not found" });
//     }

//     // Extract new image file paths if uploaded
//     let updatedImages = existingService.images; // Keep existing images
//     if (req.files && req.files.length > 0) {
//       const filePaths = req.files.map((file) => file.path);
//       const cloudinaryRes = await uploadToCloudinary(filePaths);
//       updatedImages = [...existingService.images, ...cloudinaryRes]; // Append new images
//     }

//     // Update only provided fields
//     const updatedData = {
//       title: req.body.title || existingService.title,
//       category: req.body.category || existingService.category,
//       description: req.body.description || existingService.description,
//       price: req.body.price || existingService.price,
//       availability: req.body.availability || existingService.availability,
//       service_area: req.body.service_area || existingService.service_area,
//       images: updatedImages,
//     };

//     // Update the service
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       serviceId,
//       updatedData,
//       { new: true, runValidators: true }
//     );

//     console.log("Updated Service:", updatedService);
//     return res.status(200).json({ message: "Service updated successfully", service: updatedService });
//   } catch (error) {
//     console.error(error);
//     res.status(error.status || 500).json({ error: error.message || "Internal server error" });
//   }
// };


// const serviceUpdate = async (req, res) => {
//   try {
//     const {serviceId} = req.params;
//     // console.log(serviceId);
//     console.log(req.body)
//     console.log(req.files)
//     const service = await serviceModel.findByIdAndUpdate(serviceId, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     return res
//       .status(200)
//       .json({ message: "Service updated successfully", service });
//       console.log(service)
//   } catch (error) {
//     console.log(error);
//     res
//       .status(error.status || 500)
//       .json({ error: error.message || "internal server error" });
//   }
// };

const serviceView = async (req, res) => {
  try {
  

    const serviceId = req.params.id;
  

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
   

    const serviceId = req.params.id;
   

    const service = await serviceModel.findByIdAndDelete(serviceId);
    return res.status(200).json({ message: "Service Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

//common page service controller

const allProviderServiceView = async (req, res) => {
  try {

    const providerId=req.provider

    


    // Find services and populate the provider_id, reviews, and customer details within reviews
    const services = await serviceModel
      .find({provider_id:providerId})
      

    // Return the services with the populated data
    return res.status(200).json({ message: "Listed provider Services", services });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
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

const getOneService = async (req, res) => {
  try {

    const {serviceId} = req.params
    // Find services and populate the provider_id, reviews, and customer details within reviews
    const service = await serviceModel
      .findById(serviceId)
      .populate("provider_id")  // Populate the provider details for each service
      // .populate("reviews");

    // Return the services with the populated data
    return res.status(200).json({ message: "Service Details", service });
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
  getServices,
  getOneService,
  allProviderServiceView
};
