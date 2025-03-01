const adminDb = require("../models/adminModel");
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
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    const adminExist = await adminDb.findOne({ email });
    if (!adminExist) {
      return res.status(400).json({ message: "user not found" });
    }
    const passwordMatch = await comparePassword(password, adminExist.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = createToken(adminExist._id, "admin");
    res.cookie("Admin_token", token);
    console.log(token);
    res.status(200).json({ message: "Admin login successful", adminExist });
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
    const providerExist= await providerModel.findByIdAndUpdate(providerId,{verification_status:"true"},{new:true})
    if(!providerExist){
      return res.status(400).json({ message: "provider not found" });
    }
    res.status(200).json({ message: "provider verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};





module.exports = { adminRegister, adminLogin, adminLogout , adminVerifyProvider};
