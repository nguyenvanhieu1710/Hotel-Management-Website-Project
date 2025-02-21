import { executeQuery, closeSQLConnection } from "../config/db.js";
import { Staff } from "../models/staff";

export const getAllStaff = async (req, res) => {
  try {
    const users = await executeQuery("SELECT * FROM Staff");
    // console.log(users);
    res.send(users);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getStaffById = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await executeQuery(
      `SELECT * FROM Staff WHERE StaffId = ${id}`
    );
    // console.log(staff);
    res.send(staff);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await executeQuery(
      `INSERT INTO Staff (StaffName, Email, Phone, Address, Position) 
       VALUES (@name, @email, @phone, @address, @position)`,
      {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        address: staff.address,
        position: staff.position,
      }
    );
    res.send(staff);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const updateStaff = (req, res) => {
  res.send("Update staff");
};
export const deleteStaff = (req, res) => {
  res.send("Delete staff");
};
