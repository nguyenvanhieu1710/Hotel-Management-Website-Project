import { executeQuery, closeSQLConnection } from "../config/db";

export const getAllBookingVotes = async (req, res) => {
  try {
    const bookingVotes = await executeQuery("SELECT * FROM BookingVotes");
    res.send(bookingVotes);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getBookingVotesById = async (req, res) => {
  try {
    const id = req.params.id;
    const bookingVotes = await executeQuery(
      `SELECT * FROM BookingVotes WHERE BookingVotesId = ${id}`
    );
    res.send(bookingVotes);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const createBookingVotes = async (req, res) => {
  try {
    await executeQuery(
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
  } finally {
    await closeSQLConnection();
  }
};

export const updateBookingVotes = async (req, res) => {
  try {
    await executeQuery(
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
  } finally {
    await closeSQLConnection();
  }
};

export const deleteBookingVotes = async (req, res) => {
  try {
    const id = req.params.id;
    await executeQuery(`DELETE FROM BookingVotes WHERE BookingVotesId = ${id}`);
    res.send("Delete booking votes successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};
