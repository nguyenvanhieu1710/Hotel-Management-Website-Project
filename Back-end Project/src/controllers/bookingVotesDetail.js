import { executeMysqlQuery } from "../config/db";
import BookingVotesDetail from "../models/BookingVotesDetail";
import { bookingVotesDetailSchema } from "../schemas/bookingVotesDetail";

export const getAllBookingVotesDetail = async (req, res) => {
  try {
    const bookingVotesDetail = await executeMysqlQuery(
      "SELECT * FROM BookingVotesDetail WHERE Deleted = 0"
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
