import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { registerSchema, loginSchema } from "../schemas/auth";
import { User } from "./../models/user";

export const Register = async (req, res) => {
  try {
    const data = await req.body;
    // TODO: validate data
    const { error } = registerSchema.validate(data, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // assign data to variables
    const { userName, email, password, age } = data;
    // check if user already exists
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // console.log(hashedPassword);
    // create user
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      age,
    });
    await user.save();
    // return user
    res.status(201).json({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const data = await req.body;
    // TODO: validate data
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email, password } = data;
    // Find the user
    const existUser = await User.findOne({ email: email });
    // console.log("Exist User", existUser, "\n");
    if (!existUser) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check the password
    const isMatch = await bcryptjs.compare(password, existUser.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // console.log("Token", token, "\n");
    return res.status(200).json({ user: existUser, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
