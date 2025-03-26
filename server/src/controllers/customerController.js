const customerDb = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const serviceModel = require("../models/serviceModel");
const { createToken } = require("../utils/generateToken");
const { hashpassword, comparePassword } = require("../utils/passwordUtil");

const customerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    const alreadyExist = await customerDb.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "Email already exist." });
    }

    const hashedPassword = await hashpassword(password);
    const newCustomer = new customerDb({
      name,
      email,
      password: hashedPassword
    });
    const saved = await newCustomer.save();
    if (saved) {
      return res
        .status(201)
        .json({ message: "Customer created successfully.", saved });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};


const customerLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
         return res.status(400).json({message:"Please fill all the fields."})
        }
        const customerExist =await customerDb.findOne({email})
        if(!customerExist){
         return res.status(400).json({error:"Customer not found"})
        }
        const passwordMatch=await comparePassword(password,customerExist.password)
        console.log(passwordMatch)
        if(!passwordMatch){
         return res.status(400).json({error:"Invalid password"})
        }
        const token = createToken(customerExist._id,"customer")
        res.cookie("customer_token",token,{
          httpOnly: true,       // Prevents client-side access to the cookie
          secure: true, // Cookie is sent over HTTPS only in production
          sameSite: 'None',     // Allows cookies to be sent across domains
        })
        console.log(token)
        res.status(200).json({message:"Customer login successful",user:customerExist})
     }catch(error){
         console.log(error);
         res.status(error.status || 500).json({error:error.message || "internal server error"})
     }
}

const customerLogout = async (req,res)=>{
    try{
        res.clearCookie("customer_token",{
          httpOnly: true,       // Prevents client-side access to the cookie
          secure: true, // Cookie is sent over HTTPS only in production
          sameSite: 'None',     // Allows cookies to be sent across domains
        })
        res.status(200).json({message:"logout successfully"})

    }catch(error){
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "internal server error"})
    }
}


const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.customer;

    const customer = await customerDb.findById(customerId).select("-password"); // Exclude password field
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Profile fetched successfully", customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};


const changeCustomerPassword = async (req, res) => {
  try {
    const customerId = req.customer;
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both old and new passwords." });
    }

    const customer = await customerDb.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isMatch = await comparePassword(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    const hashedPassword = await hashpassword(newPassword);
    customer.password = hashedPassword;
    await customer.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};






module.exports={customerRegister,customerLogin,customerLogout,getCustomerProfile,changeCustomerPassword}