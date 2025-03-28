import bcryptjs from "bcryptjs";

import { executeMysqlQuery } from "../config/db";
import User from "../models/user";
import { userSchema } from "../schemas/user";

export const getAllUsers = async (req, res) => {
  try {
    const users = await executeMysqlQuery(
      "SELECT * FROM Users WHERE Deleted = 0"
    );
    res.send(users);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await executeMysqlQuery(
      `SELECT * FROM Users WHERE UserId = ${id}`
    );
    res.send(user);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const { error } = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("123456", salt);
    // console.log(hashedPassword);
    await executeMysqlQuery(
      `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.UserName,
        hashedPassword,
        "User",
        user.UserName + "@gmail.com",
        "Offline",
        "2025-03-11",
        false,
      ]
    );
    // find id of the account to create user
    const accountResult = await executeMysqlQuery(
      "SELECT AccountId FROM Account WHERE Email = ?",
      [user.UserName + "@gmail.com"]
    );
    const accountId = accountResult[0].AccountId;
    await executeMysqlQuery(
      `INSERT INTO Users (UserId, IdentificationNumber, UserName, UserImage, DateOfBirth, Gender, PhoneNumber, Address, Deleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accountId,
        user.IdentificationNumber,
        user.UserName,
        user.UserImage,
        user.DateOfBirth,
        user.Gender,
        user.PhoneNumber,
        user.Address,
        user.Deleted,
      ]
    );
    res.send({ message: "Created user successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const { error } = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE Users 
       SET IdentificationNumber = ?, 
           UserName = ?, 
           UserImage = ?,
           DateOfBirth = ?, 
           Gender = ?, 
           PhoneNumber = ?, 
           Address = ?, 
           Deleted = ? 
       WHERE UserId = ?`,
      [
        user.IdentificationNumber,
        user.UserName,
        user.UserImage,
        user.DateOfBirth,
        user.Gender,
        user.PhoneNumber,
        user.Address,
        user.Deleted,
        user.UserId,
      ]
    );
    res.send({ message: "Updated user successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await executeMysqlQuery(
      `UPDATE Users SET Deleted = 1 WHERE UserId = ${id}`
    );
    res.send({ message: "Deleted user successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
