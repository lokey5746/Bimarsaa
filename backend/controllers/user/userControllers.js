import User from "../../models/user/userModel.js";
import generateToken from "../../utilis/generateToken.js";
import { hashPassword } from "../../utilis/helper.js";

// @desc  Register User
// @route POST /api/user
// @access Public
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status.json({
        message: "Password should be at least 6 character long",
      });
    }
    if (username.length < 3) {
      return res.status.json({
        message: "Username should be at least 3 character long",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ sucess: false, message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(400)
        .json({ sucess: false, message: "Username already exists" });
    }

    // getrandom avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = await User.create({
      username,
      email,
      password: await hashPassword(password),
      profileImage,
    });

    if (user) {
      generateToken(user._id);
      res.status(201).json({
        status: "success",
        message: "user register sucessfully",
        data: user,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  res.send("Login Controller");
};

const logoutUser = async (req, res) => {
  res.send("Logout Controller");
};

export { registerUser, loginUser, logoutUser };
