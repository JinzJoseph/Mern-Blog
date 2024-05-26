import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res) => {
  console.log(req.params);
  console.log(req.user.id);
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({
      message: "You are not allowed to update this user",
      success: false,
    });
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 7 and 20 characters",
        success: false,
      });
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json({
        message: "Username cannot contain spaces",
        success: false,
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        message: "Username must be lowercase",
        success: false,
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res.status(400).json({
        message: "Username can only contain letters and numbers",
        success: false,
      });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePic: req.body.profilePic,
          password: req.body.password,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const { password, ...rest } = updatedUser.toObject();

    return res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  //console.log(req.params.id);
  if ( req.user.isAdmin===false  && req.user.id !== req.params.id)
    return res.status(401).json({
      message: "You can only delete your own account",
      success: false,
    });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); // Corrected method name to clearCookie
    res.status(200).json({
      message: "User has been successfully deleted",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
export const getusers = async (req, res) => {


  if (req.user.isAdmin===false) {
    return res.status(403).json("you are not allowed to take these action")
    
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
export const singleUser=async(req,res)=>{
  try {
    const user=await User.findById(req.params.userId)
    if(!user){
      return res.status(404).json({
        message:"User is not found",
        success:false
      })
    }const { password, ...rest } = user._doc;
    res.status(200).json(rest)
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
}