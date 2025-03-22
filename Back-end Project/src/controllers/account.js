import bcryptjs from "bcryptjs";

import { executeMysqlQuery } from "../config/db.js";
import Account from "../models/account.js";
import { accountSchema } from "./../schemas/account";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await executeMysqlQuery(
      "SELECT * FROM Account WHERE Deleted = 0"
    );
    if (accounts.length === 0) {
      res.status(404).send("No accounts found");
    } else {
      res.send(accounts);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await executeMysqlQuery(
      "SELECT * FROM Account WHERE AccountId = ? AND Deleted = 0",
      [id]
    );
    if (account.length === 0) {
      res.status(404).send("No account found");
    } else {
      res.send(account[0]);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const createAccount = async (req, res) => {
  try {
    const { error } = accountSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const account = new Account(req.body);
    // check if account already exists
    const existAccount = await executeMysqlQuery(
      "SELECT * FROM Account WHERE Email = ?",
      [account.Email]
    );
    if (existAccount.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(account.Password, salt);
    // console.log(hashedPassword);
    const creationDate = req.body.creationDate
      ? req.body.creationDate.slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");
    await executeMysqlQuery(
      `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        account.AccountName,
        hashedPassword,
        account.Role,
        account.Email,
        account.Status,
        creationDate,
        account.Deleted,
      ]
    );
    // find id of the account to create user or staff
    const accountResult = await executeMysqlQuery(
      "SELECT AccountId FROM Account WHERE Email = ?",
      [account.Email]
    );
    const accountId = accountResult[0].AccountId;
    if (account.Role === "User") {
      await executeMysqlQuery(
        `INSERT INTO Users (UserId, IdentificationNumber, UserName, DateOfBirth, Gender, PhoneNumber, Address, Deleted) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accountId,
          "123456",
          account.AccountName,
          "2025-03-11",
          "Male",
          "0123456789",
          "No",
          account.Deleted,
        ]
      );
    } else if (account.Role === "Staff") {
      const dateOfBirth = req.body.DateOfBirth
        ? req.body.DateOfBirth.slice(0, 19).replace("T", " ")
        : new Date().toISOString().slice(0, 19).replace("T", " ");
      const workStartDate = req.body.WorkStartDate
        ? req.body.WorkStartDate.slice(0, 19).replace("T", " ")
        : new Date().toISOString().slice(0, 19).replace("T", " ");
      await executeMysqlQuery(
        `INSERT INTO Staff 
         (StaffId, StaffName, DateOfBirth, Gender, PhoneNumber, Address, Position, Salary, Status, WorkStartDate, Description, Deleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accountId,
          account.AccountName,
          dateOfBirth,
          "Male",
          "0123456789",
          "No",
          "No",
          "0",
          "Offline",
          workStartDate,
          "No",
          account.Deleted,
        ]
      );
    } else if (account.Role === "Admin") {
      console.log("Admin created");
    }
    res.status(201).send({ message: "Account created successfully" });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { error } = accountSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const account = new Account(req.body);
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(account.Password, salt);
    // console.log(hashedPassword);
    const creationDate = req.body.creationDate
      ? req.body.creationDate.slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");
    await executeMysqlQuery(
      `UPDATE Account SET AccountName =?, Password =?, Role =?, Email =?, Status =?, CreationDate =? WHERE AccountId =?`,
      [
        account.AccountName,
        hashedPassword,
        account.Role,
        account.Email,
        account.Status,
        creationDate,
        account.AccountId,
      ]
    );
    res.send({ message: "Account updated successfully" });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await executeMysqlQuery(
      `UPDATE Account SET Deleted = 1 WHERE AccountId =?`,
      [id]
    );
    res.send({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};
