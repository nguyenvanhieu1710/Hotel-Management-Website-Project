import { executeMysqlQuery } from "../config/db";
import BookingVotes from "../models/BookingVotes";
import { bookingVotesSchema } from "../schemas/bookingVotes";

export const getAllBookingVotes = async (req, res) => {
  try {
    const bookingVotes = await executeMysqlQuery(
      "SELECT * FROM BookingVotes WHERE Deleted = 0"
    );
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
      TotalAmount,
      Deleted,
      listBookingVotesDetails,
    } = req.body;
    const { error } = bookingVotesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const result = await executeMysqlQuery(
      `INSERT INTO BookingVotes (UserId, BookingDate, CheckinDate, CheckoutDate, Note, TotalAmount, Deleted)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        UserId,
        BookingDate,
        CheckinDate,
        CheckoutDate,
        Note,
        TotalAmount,
        Deleted,
      ]
    );
    const bookingVotesId = result.insertId;
    for (const detail of listBookingVotesDetails) {
      const {
        RoomId,
        RoomPrice,
        Note: detailNote,
        Deleted: detailDeleted,
      } = detail;
      await executeMysqlQuery(
        `INSERT INTO BookingVotesDetail (BookingVotesId, RoomId, RoomPrice, Note, Deleted)
         VALUES (?, ?, ?, ?, ?)`,
        [bookingVotesId, RoomId, RoomPrice, detailNote, detailDeleted]
      );
    }
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
      TotalAmount,
      Deleted,
      listBookingVotesDetails,
    } = req.body;
    const { error } = bookingVotesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE BookingVotes
       SET UserId = ?, BookingDate = ?, CheckinDate = ?, CheckoutDate = ?, Note = ?, TotalAmount=?, Deleted = ?
       WHERE BookingVotesId = ?`,
      [
        UserId,
        BookingDate,
        CheckinDate,
        CheckoutDate,
        Note,
        TotalAmount,
        Deleted,
        BookingVotesId,
      ]
    );
    if (listBookingVotesDetails && listBookingVotesDetails.length > 0) {
      for (const detail of listBookingVotesDetails) {
        const {
          BookingVotesDetailId,
          RoomId,
          RoomPrice,
          Note: detailNote,
          Deleted: detailDeleted,
        } = detail;
        await executeMysqlQuery(
          `UPDATE BookingVotesDetail
           SET BookingVotesId = ?, RoomId = ?, RoomPrice=?, Note = ?, Deleted = ?
           WHERE BookingVotesDetailId = ?`,
          [
            BookingVotesId,
            RoomId,
            RoomPrice,
            detailNote,
            detailDeleted,
            BookingVotesDetailId,
          ]
        );
      }
    }
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
      `UPDATE BookingVotes SET Deleted = 1 WHERE BookingVotesId = ?`,
      [id]
    );
    await executeMysqlQuery(
      "UPDATE BookingVotesDetail SET Deleted = 1 WHERE BookingVotesId = ?",
      [id]
    );
    res.send({ message: "Delete booking votes successfully!" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
