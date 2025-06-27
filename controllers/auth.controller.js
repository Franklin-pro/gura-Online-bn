import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndCookie from "../utils/generateToken.js";
import crypto from 'crypto';
import sendPasswordResetEmail from "../utils/emailSent.js";


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "Email already in use" }); 
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        const token = generateTokenAndCookie(user._id, res);
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(201).json({ 
            success: true,
            message: "User registered successfully", 
            user: userResponse, 
            token 
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false,
            message: "Registration failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateTokenAndCookie(user._id, res);
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(200).json({ 
            success: true,
            message: "Login successful", 
            user: userResponse, 
            token 
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Login failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
const logout =(req, res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "User logged out successfully"})
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({error: "internal server error"})
    }
    
    }

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken);
      
      res.status(200).json({ 
        success: true, 
        message: 'Password reset email sent successfully' 
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        message: 'Failed to send password reset email',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log(`Token validation failed for: ${req.params.token}`);
      return res.status(400).json({ 
        success: false,
        message: 'Password reset token is invalid or has expired' 
      });
    }
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    const token = generateTokenAndCookie(user._id, res);
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully',
      token 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({message: "User profile", user})
    } catch (error) {
        console.log("error in getProfile controller", error.message)
        res.status(500).json({error: "internal server error"})
    }
}

export { register, login, logout, getProfile,forgotPassword,resetPassword };
