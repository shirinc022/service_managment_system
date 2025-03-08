const customerDb = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const serviceModel = require("../models/serviceModel");
const { createToken } = require("../utils/generateToken");
const { hashpassword, comparePassword } = require("../utils/passwordUtil");

const customerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
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
         return res.status(400).json({message:"Customer not found"})
        }
        const passwordMatch=await comparePassword(password,customerExist.password)
        console.log(passwordMatch)
        if(!passwordMatch){
         return res.status(400).json({message:"Invalid password"})
        }
        const token = createToken(customerExist._id,"customer")
        res.cookie("customer_token",token)
        console.log(token)
        res.status(200).json({message:"Customer login successful",customerExist})
     }catch(error){
         console.log(error);
         res.status(error.status || 500).json({error:error.message || "internal server error"})
     }
}

const customerLogout = async (req,res)=>{
    try{
        res.clearCookie("customer_token")
        res.status(200).json({message:"logout successfully"})

    }catch(error){
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "internal server error"})
    }
}





module.exports={customerRegister,customerLogin,customerLogout}