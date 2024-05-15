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

    return res.status(200).json({
      user: rest,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


