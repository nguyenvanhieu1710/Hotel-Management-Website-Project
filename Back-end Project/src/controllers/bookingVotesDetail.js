import { executeMysqlQuery } from "../config/db";
import BookingVotesDetail from "../models/BookingVotesDetail";
import { bookingVotesDetailSchema } from "../schemas/bookingVotesDetail";

export const getAllBookingVotesDetail = async (req, res) => {
  try {
    const bookingVotesDetail = await executeMysqlQuery(
      "SELECT * FROM BookingVotesDetail"
    );
    res.send(bookingVotesDetail);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getBookingVotesDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const bookingVotesDetail = await executeMysqlQuery(
      `SELECT * FROM BookingVotesDetail WHERE BookingVotesDetailId = ${id}`
    );
    res.send(bookingVotesDetail);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createBookingVotesDetail = async (req, res) => {
  try {
    const { BookingVotesId, RoomId, Note, Deleted } = req.body;
    const { error } = bookingVotesDetailSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO BookingVotesDetail (BookingVotesId, RoomId, Note, Deleted)
       VALUES (?, ?, ?, ?)`,
      [BookingVotesId, RoomId, Note, Deleted]
    );
    res.send({ message: "Create booking votes detail successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateBookingVotesDetail = async (req, res) => {
  try {
    const { BookingVotesDetailId, BookingVotesId, RoomId, Note, Deleted } =
      req.body;
    const { error } = bookingVotesDetailSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE BookingVotesDetail
       SET BookingVotesId = ?, RoomId = ?, Note = ?, Deleted = ?
       WHERE BookingVotesDetailId = ?`,
      [BookingVotesId, RoomId, Note, Deleted, BookingVotesDetailId]
    );
    res.send({ message: "Update booking votes detail successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteBookingVotesDetail = async (req, res) => {
  try {
    const id = req.params.id;
    await executeMysqlQuery(
      "DELETE FROM BookingVotesDetail WHERE BookingVotesDetailId = ?",
      [id]
    );
    res.send({ message: "Delete booking votes detail successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
