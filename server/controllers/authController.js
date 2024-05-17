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
export const signin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    res.status(400).json({
      message: "All Feilds are required",
      success: false,
    });
  }
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res.status(401).send({
        message: "invalid User",
      });
    }
    const validpassword = bcrypt.compareSync(password, validUser.password);
    if (!validpassword) {
      return res.status(401).send({
        message: "invalid credentials",
      });
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const googleAuth = async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
         rest,
      });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatePassword, salt);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        profilePic: req.body.googlePhoto,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(
        rest,
      );
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const signout=async(req,res,next)=>{
  // console.log("hallo");
  try {
    res.clearCookie('access_token')
    res.status(200).json({
      message:"User has been logged out",
      success:true
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
}