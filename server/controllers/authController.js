import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        message: "All Fields are Required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedpassword });
    await newUser.save();

    // You may generate a JWT token here if needed

    res.status(200).json({
      message: "Signup Successful",
      success: true,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
