import { executeQuery, closeSQLConnection } from "../config/db";

export const getAllUsers = async (req, res) => {
  try {
    const users = await executeQuery("SELECT * FROM Users");
    res.send(users);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await executeQuery(`SELECT * FROM Users WHERE UserId = ${id}`);
    res.send(user);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const createUser = async (req, res) => {
  try {
    await executeQuery(
      `INSERT INTO Users (IdentificationNumber, UserName, DateOfBirth, Gender) VALUES (@identificationNumber, @userName, @dateOfBirth, @gender)`,
      {
        identificationNumber: req.body.identificationNumber,
        userName: req.body.userName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
      }
    );
    res.send(req.body);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const updateUser = async (req, res) => {
  try {
    await executeQuery(
      `UPDATE Users SET IdentificationNumber = @identificationNumber, UserName = @userName, DateOfBirth
= @dateOfBirth, Gender = @gender WHERE UserId = @userId`,
      {
        userId: req.body.userId,
        identificationNumber: req.body.identificationNumber,
        userName: req.body.userName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
      }
    );
    res.send(req.body);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await executeQuery(`DELETE FROM Users WHERE UserId = ${id}`);
    res.send("Delete user successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
