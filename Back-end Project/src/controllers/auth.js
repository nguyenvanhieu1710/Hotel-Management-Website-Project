import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { executeMysqlQuery } from "../config/db";
import { registerSchema, loginSchema } from "../schemas/auth";
import Account from "../models/account";
import User from "./../models/user";

export const Register = async (req, res) => {
  try {
    const data = await req.body;
    // TODO: validate data
    const { error } = registerSchema.validate(data, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // assign data to variables
    const { email, password } = data;
    // check if account already exists
    const existAccount = await executeMysqlQuery(
      "SELECT * FROM Account WHERE Email = ?",
      [email]
    );
    if (existAccount.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // console.log(hashedPassword);
    // create user and account
    const creationDate =
      req.body.creationDate ||
      new Date().toISOString().slice(0, 19).replace("T", " ");
    const account = new Account({
      AccountName: req.body.email || "User",
      Password: req.body.password || "123",
      Role: req.body.role || "User",
      Email: req.body.email || "default@example.com",
      Status: req.body.status || "Offline",
      CreationDate: creationDate,
      Deleted: req.body.deleted || false,
    });
    await executeMysqlQuery(
      "INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        account.AccountName,
        hashedPassword,
        account.Role,
        account.Email,
        account.Status,
        account.CreationDate,
        account.Deleted,
      ]
    );
    // find id of the account to create user
    const accountResult = await executeMysqlQuery(
      "SELECT AccountId FROM Account WHERE Email = ?",
      [email]
    );
    const accountId = accountResult[0].AccountId;
    // console.log(accountId);

    const dateOfBirth =
      req.body.dateOfBirth ||
      new Date().toISOString().slice(0, 19).replace("T", " ");
    const user = new User({
      UserId: accountId,
      IdentificationNumber: "123",
      UserName: req.body.email || "User",
      DateOfBirth: dateOfBirth,
      Gender: req.body.gender || "Male",
      PhoneNumber: req.body.phoneNumber || "Phone Number",
      Address: req.body.address || "Default Address",
      Deleted: req.body.deleted || false,
    });
    await executeMysqlQuery(
      "INSERT INTO Users (UserId, IdentificationNumber, UserName, DateOfBirth, Gender, PhoneNumber, Address, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.UserId,
        user.IdentificationNumber,
        user.UserName,
        user.DateOfBirth,
        user.Gender,
        user.PhoneNumber,
        user.Address,
        user.Deleted,
      ]
    );
    // return
    res.status(200).json({ message: "Register successfully" });
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
    // check if account already exists
    const existAccount = await executeMysqlQuery(
      "SELECT * FROM Account WHERE Email = ?",
      [email]
    );
    // console.log(existAccount);

    if (existAccount.length === 0) {
      return res.status(400).json({ message: "Email is not exists" });
    }

    const account = existAccount[0];
    const role = account.Role;

    // Check the password
    const isMatch = await bcryptjs.compare(password, account.Password);
    if (!isMatch) {
      // console.log("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // console.log("Token", token, "\n");
    account.token = token;
    return res.status(200).json({ account: account });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
