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
    res.cookie("Admin_token", token);
    res.status(200).json({ message: "Admin login successful", user:adminExist });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.clearCookie("Admin_token");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

const adminVerifyProvider= async (req, res) => {
  try {
    const {providerId}=req.params
    const providerExist= await providerModel.findByIdAndUpdate(providerId,{verification_status:"Verified"},{new:true})
    if(!providerExist){
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

const adminRejectProvider =async (req, res) => {
  try {
    const {providerId}=req.params
    const providerExist= await providerModel.findByIdAndUpdate(providerId,{verification_status:"Rejected"},{new:true})
    if(!providerExist){
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


const getCustomers = async(req,res)=>{
  try{

    const customers= await  customerModel.find()
    if(!customers){
      return res.status(400).json({ error: "customers not found" });
    }
    res.status(200).json(customers)



  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
}


const getProviders = async(req,res)=>{
  try{

    const providers= await  providerModel.find()
    if(!providers){
      return res.status(400).json({ error: "providers not found" });
    }
    res.status(200).json(providers)



  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
}


const getOrdersView = async(req,res)=>{
  try{

    const orders= await  orderModel.find().populate("Provider_id customer_id service_id")
    if(!orders){
      return res.status(400).json({ error: "orders not found" });
    }
    res.status(200).json(orders)



  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
}



module.exports = { adminRegister, adminLogin, adminLogout , adminVerifyProvider,getCustomers,getProviders,getOrdersView, adminRejectProvider};
