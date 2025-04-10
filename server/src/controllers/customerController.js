const customerDb = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const serviceModel = require("../models/serviceModel");
const { createToken } = require("../utils/generateToken");
const { hashpassword, comparePassword } = require("../utils/passwordUtil");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const customerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    const alreadyExist = await customerDb.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "Email already exist." });
    }

    const hashedPassword = await hashpassword(password);

    // Generate email verification token (expires in 1 hour)
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRETKEY, {
      expiresIn: "1h",
    });

    const newCustomer = new customerDb({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
    const saved = await newCustomer.save();

    if (saved) {
      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      return res.status(201).json({
        message:
          "Customer registered successfully. Check your email to verify your account.",
        token: verificationToken,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
};

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the link below to verify your email:</p>
         <a href="${verificationLink}" style="text-decoration: none;">
           <button style="background-color: #007bff; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">
             Verify Email
           </button>
         </a>
         <p>This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// customer verify
const customerVerify = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    const customer = await customerDb.findOne({ email: decoded.email });

    if (!customer) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    customer.isVerified = true;
    customer.verificationToken = null; // Remove token after verification
    await customer.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// customer Login
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }

    const customerExist = await customerDb.findOne({ email });

    if (!customerExist) {
      return res.status(400).json({ error: "Customer not found" });
    }

    // ✅ Check if the customer is verified
    if (!customerExist.isVerified) {
      return res
        .status(400)
        .json({
          error: "Your email is not verified. Please verify before logging in.",
        });
    }

    const passwordMatch = await comparePassword(
      password,
      customerExist.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = createToken(customerExist._id, "customer");
    res.cookie("customer_token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: true, // Cookie is sent over HTTPS only in production
      sameSite: "None", // Allows cookies to be sent across domains
    });

    res
      .status(200)
      .json({ message: "Customer login successful", user: customerExist });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const customerLogout = async (req, res) => {
  try {
    res.clearCookie("customer_token", {
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
      return res
        .status(400)
        .json({ message: "Please provide both old and new passwords." });
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

module.exports = {
  customerRegister,
  customerVerify,
  customerLogin,
  customerLogout,
  getCustomerProfile,
  changeCustomerPassword,
};
