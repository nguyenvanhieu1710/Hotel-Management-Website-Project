import { executeQuery, closeSQLConnection } from "../config/db.js";
import Account from "../models/account.js";
import { accountSchema } from "./../schemas/account";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await executeQuery(
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
  } finally {
    await closeSQLConnection();
  }
};

export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await executeQuery(
      "SELECT * FROM Account WHERE Id = ? AND Deleted = 0",
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
  } finally {
    await closeSQLConnection();
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
    await account.save();
    res.send(account);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = accountSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const account = new Account(req.body);
    await account.update(id);
    res.send(account);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = new Account();
    await account.delete(id);
    res.send("Account deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const login = async (req, res) => {
  try {
    const { accountName, password } = req.body;
    const account = await executeQuery(
      "SELECT * FROM Account WHERE AccountName = ? AND Password = ? AND Deleted = 0",
      [accountName, password]
    );
    if (account.length === 0) {
      res.status(404).send("No account found");
    } else {
      res.send(account[0]);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};
