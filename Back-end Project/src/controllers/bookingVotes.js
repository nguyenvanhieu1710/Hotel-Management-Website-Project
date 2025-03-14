import { executeMysqlQuery } from "../config/db";

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
    await executeMysqlQuery(
      `INSERT INTO BookingVotes (BookingId, UserId, Vote) 
         VALUES (@bookingId, @userId, @vote)`,
      {
        bookingId: req.body.bookingId,
        userId: req.body.userId,
        vote: req.body.vote,
      }
    );
    res.send("Create booking votes successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateBookingVotes = async (req, res) => {
  try {
    await executeMysqlQuery(
      `UPDATE BookingVotes SET Vote = @vote WHERE BookingVotesId = @id`,
      {
        vote: req.body.vote,
        id: req.body.id,
      }
    );
    res.send("Update booking votes successfully!");
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
    res.send("Delete booking votes successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
