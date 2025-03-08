// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const adminModel = require("../models/adminModel");
// const customerModel = require("../models/customerModel");
// const providerModel = require("../models/providerModel");

// const createToken = (id, role) => {
//     return jwt.sign({ id, role }, process.env.JWT_SECRETKEY, { expiresIn: "1d" });
// };

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Please fill all fields." });
//         }

//         let user = await adminModel.findOne({ email });
//         let role = "admin";

//         if (!user) {
//             user = await customerModel.findOne({ email });
//             role = "customer";
//         }

//         if (!user) {
//             user = await providerModel.findOne({ email });
//             role = "provider";
//         }

//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(400).json({ message: "Invalid password" });
//         }

//         const token = createToken(user._id, role);
//         res.cookie("user_token", token, { httpOnly: true });

//         res.status(200).json({
//             message: "Login successful",
//             user: { id: user._id, name: user.name, email: user.email, role },
//             token
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = { loginUser };
