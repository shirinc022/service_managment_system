const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true, index:true },
    password: { type: String, required: true },
    phone: { type: Number},
    role: { type: String, required: true, default: "admin" }
});

module.exports = mongoose.model('Admins', adminSchema);
