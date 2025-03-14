import { executeMysqlQuery } from "../config/db.js";
import Staff from "../models/staff";
import { staffSchema } from "../schemas/staff";

export const getAllStaff = async (req, res) => {
  try {
    const staffs = await executeMysqlQuery("SELECT * FROM Staff");
    // console.log(staffs);
    res.send(staffs);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getStaffById = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await executeMysqlQuery(
      `SELECT * FROM Staff WHERE StaffId = ${id}`
    );
    // console.log(staff);
    res.send(staff);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    const { error } = staffSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        staff.StaffName,
        "staff123",
        "Staff",
        staff.StaffName + "@gmail.com",
        "Offline",
        "2025-03-11",
        false,
      ]
    );
    // find id of the account to create user
    const accountResult = await executeMysqlQuery(
      "SELECT AccountId FROM Account WHERE Email = ?",
      [staff.StaffName + "@gmail.com"]
    );
    const accountId = accountResult[0].AccountId;
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
        staff.StaffName,
        dateOfBirth,
        staff.Gender,
        staff.PhoneNumber,
        staff.Address,
        staff.Position,
        staff.Salary,
        staff.Status,
        workStartDate,
        staff.Description,
        staff.Deleted,
      ]
    );
    res.send({ message: "Created Staff successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    const { error } = staffSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const dateOfBirth = req.body.DateOfBirth
      ? req.body.DateOfBirth.slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");
    const workStartDate = req.body.WorkStartDate
      ? req.body.WorkStartDate.slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");
    await executeMysqlQuery(
      `UPDATE Staff SET StaffName =?, DateOfBirth =?, Gender =?, PhoneNumber =?, Address =?, Position =?, Salary =?, Status =?, WorkStartDate =?, Description =?, Deleted =? WHERE StaffId =?`,
      [
        staff.StaffName,
        dateOfBirth,
        staff.Gender,
        staff.PhoneNumber,
        staff.Address,
        staff.Position,
        staff.Salary,
        staff.Status,
        workStartDate,
        staff.Description,
        staff.Deleted,
        staff.StaffId,
      ]
    );
    res.send({ message: "Updated Staff successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
export const deleteStaff = async (req, res) => {
  try {
    const id = req.params.id;
    await executeMysqlQuery("UPDATE Staff SET Deleted = 1 WHERE StaffId =?", [
      id,
    ]);
    res.send({ message: "Deleted Staff successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
