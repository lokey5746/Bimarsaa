import User from "../../models/user/userModel.js";
import generateToken from "../../utilis/generateToken.js";
import {
  hashPassword,
  validateRegisterInput,
  verifyPassword,
} from "../../utilis/helper.js";

// @desc  Register User
// @route POST /api/user
// @access Public
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const validationError = validateRegisterInput({
      email,
      username,
      password,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
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

// @desc  Login User
// @route POST /api/user/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check either mail exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or password invalid" });
    }

    // verify password
    const isMatched = await verifyPassword(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Email or password invalid" });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      status: "success",
      message: "user register sucessfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  res.send("Logout Controller");
};

export { registerUser, loginUser, logoutUser };
