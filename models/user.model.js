import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true,minlength:[6,"Password must be at least 6 characters"]},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    cartItem:[{
        quantity: {type: Number, default: 1},
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"}
    }],
    role: {type: String, default: "customer", enum: ["customer", "admin"]},
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;