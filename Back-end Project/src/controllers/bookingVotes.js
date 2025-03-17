import { executeMysqlQuery } from "../config/db";
import BookingVotes from "../models/BookingVotes";
import { bookingVotesSchema } from "../schemas/bookingVotes";

export const getAllBookingVotes = async (req, res) => {
  try {
    const bookingVotes = await executeMysqlQuery("SELECT * FROM BookingVotes");
    res.send(bookingVotes);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getBookingVotesById = async (req, res) => {
  try {
    const id = req.params.id;
    const bookingVotes = await executeMysqlQuery(
      `SELECT * FROM BookingVotes WHERE BookingVotesId = ${id}`
    );
    res.send(bookingVotes);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createBookingVotes = async (req, res) => {
  try {
    const {
      BookingVotesId,
      UserId,
      BookingDate,
      CheckinDate,
      CheckoutDate,
      Note,
      Deleted,
    } = req.body;
    const { error } = bookingVotesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO BookingVotes (UserId, BookingDate, CheckinDate, CheckoutDate, Note, Deleted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [UserId, BookingDate, CheckinDate, CheckoutDate, Note, Deleted]
    );
    res.send({ message: "Create booking votes successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateBookingVotes = async (req, res) => {
  try {
    const {
      BookingVotesId,
      UserId,
      BookingDate,
      CheckinDate,
      CheckoutDate,
      Note,
      Deleted,
    } = req.body;
    const { error } = bookingVotesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE BookingVotes
       SET UserId = ?, BookingDate = ?, CheckinDate = ?, CheckoutDate = ?, Note = ?, Deleted = ?
       WHERE BookingVotesId = ?`,
      [
        UserId,
        BookingDate,
        CheckinDate,
        CheckoutDate,
        Note,
        Deleted,
        BookingVotesId,
      ]
    );
    res.send({ message: "Update booking votes successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteBookingVotes = async (req, res) => {
  try {
    const id = req.params.id;
    await executeMysqlQuery(
      `DELETE FROM BookingVotes WHERE BookingVotesId = ${id}`
    );
    res.send({ message: "Delete booking votes successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
