import { executeMysqlQuery } from "../config/db.js";
import Bill from "../models/bill.js";
import { billSchema } from "../schemas/bill.js";

export const getAllBills = async (req, res) => {
  try {
    const bills = await executeMysqlQuery(
      "SELECT * FROM Bill WHERE Deleted = 0"
    );
    res.send(bills);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const getBillById = async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await executeMysqlQuery(
      `SELECT * FROM Bill WHERE BillId = ${id}`
    );
    res.send(bill);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const createBill = async (req, res) => {
  try {
    const { error } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const bill = new Bill(req.body);
    const query = `
      INSERT INTO Bill (UserId, StaffId, CreationDate, TotalAmount, Status, Note, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      bill.UserId,
      bill.StaffId,
      bill.CreationDate,
      bill.TotalAmount,
      bill.Status,
      bill.Note,
      bill.Deleted,
    ];
    await executeMysqlQuery(query, values);
    res.status(201).send("Bill created successfully");
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const updateBill = async (req, res) => {
  try {
    const { error } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const billId = req.params.id;
    const query = `
      UPDATE Bill
      SET UserId = ?, StaffId = ?, CreationDate = ?, TotalAmount = ?, Status = ?, Note = ?, Deleted = ?
      WHERE BillId = ?
    `;
    const values = [
      req.body.UserId,
      req.body.StaffId,
      req.body.CreationDate,
      req.body.TotalAmount,
      req.body.Status,
      req.body.Note,
      req.body.Deleted,
      billId,
    ];
    // console.log(values);
    const result = await executeMysqlQuery(query, values);
    if (result.affectedRows === 0) {
      res.status(404).send({ message: "Bill not found" });
    } else {
      res.status(200).send({ message: "Bill updated successfully" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const deleteBill = async (req, res) => {
  try {
    const billId = req.params.id;
    const query = "UPDATE Bill SET Deleted = ? WHERE BillId = ?";
    const values = [true, billId];
    const result = await executeMysqlQuery(query, values);
    if (result.affectedRows === 0) {
      res.status(404).send("Bill not found");
    } else {
      res.status(200).send("Bill deleted successfully");
    }
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
