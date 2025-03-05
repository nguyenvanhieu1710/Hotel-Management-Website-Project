import { executeQuery, closeSQLConnection } from "../config/db";

export const getAllBookingVotesDetail = async (req, res) => {
  try {
    const bookingVotesDetail = await executeQuery(
      "SELECT * FROM BookingVotesDetail"
    );
    res.send(bookingVotesDetail);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getBookingVotesDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const bookingVotesDetail = await executeQuery(
      `SELECT * FROM BookingVotesDetail WHERE BookingVotesDetailId = ${id}`
    );
    res.send(bookingVotesDetail);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const createBookingVotesDetail = async (req, res) => {
  try {
    await executeQuery(
      `INSERT INTO BookingVotesDetail (BookingVotesId, UserId, Vote) 
         VALUES (@bookingVotesId, @userId, @vote)`,
      {
        bookingVotesId: req.body.bookingVotesId,
        userId: req.body.userId,
        vote: req.body.vote,
      }
    );
    res.send("Create booking votes detail successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const updateBookingVotesDetail = async (req, res) => {
  try {
    await executeQuery(
      `UPDATE BookingVotesDetail SET Vote = @vote WHERE BookingVotesDetailId = @id`,
      {
        vote: req.body.vote,
        id: req.body.id,
      }
    );
    res.send("Update booking votes detail successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const deleteBookingVotesDetail = async (req, res) => {
  try {
    const id = req.params.id;
    await executeQuery(
      `DELETE FROM BookingVotesDetail WHERE BookingVotesDetailId = ${id}`
    );
    res.send("Delete booking votes detail successfully!");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};
