import { executeMysqlQuery } from "../config/db";
import RentRoomVotes from "../models/rentRoomVotes";
import { rentRoomVotesSchema } from "../schemas/rentRoomVotes";

export const getAllRentRoomVotes = async (req, res) => {
  try {
    const result = await executeMysqlQuery("SELECT * FROM RentRoomVotes");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRentRoomVotesById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await executeMysqlQuery(
      "SELECT * FROM RentRoomVotes WHERE RentRoomVotesId =?",
      [id]
    );
    if (!result[0]) {
      return res.status(404).json({ message: "Rent Room Votes not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRentRoomVotes = async (req, res) => {
  try {
    const rentRoomVote = new RentRoomVotes(req.body);
    const { error } = rentRoomVotesSchema.validate(rentRoomVote, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const {
      UserId,
      ActualCheckinDate,
      ActualCheckoutDate,
      TotalAmount,
      Status,
      Note,
      Deleted,
    } = rentRoomVote;
    await executeMysqlQuery(
      `INSERT INTO RentRoomVotes (
          UserId,
          ActualCheckinDate,
          ActualCheckoutDate,
          TotalAmount,
          Status,
          Note,
          Deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        UserId,
        ActualCheckinDate,
        ActualCheckoutDate,
        TotalAmount,
        Status,
        Note,
        Deleted,
      ]
    );
    res.status(201).json({ message: "Created Rent Room Vote successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRentRoomVotes = async (req, res) => {
  try {
    const rentRoomVote = new RentRoomVotes(req.body);
    const { error } = rentRoomVotesSchema.validate(rentRoomVote, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const {
      RentRoomVotesId,
      UserId,
      ActualCheckinDate,
      ActualCheckoutDate,
      TotalAmount,
      Status,
      Note,
      Deleted,
    } = rentRoomVote;
    await executeMysqlQuery(
      `UPDATE RentRoomVotes SET
          UserId = ?,
          ActualCheckinDate = ?,
          ActualCheckoutDate = ?,
          TotalAmount = ?,
          Status = ?,
          Note = ?,
          Deleted = ?
        WHERE RentRoomVotesId = ?`,
      [
        UserId,
        ActualCheckinDate,
        ActualCheckoutDate,
        TotalAmount,
        Status,
        Note,
        Deleted,
        RentRoomVotesId,
      ]
    );
    res.status(200).json({ message: "Updated Rent Room Vote successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRentRoomVotes = async (req, res) => {
  try {
    const { id } = req.params;
    await executeMysqlQuery(
      "DELETE FROM RentRoomVotes WHERE RentRoomVotesId =?",
      [id]
    );
    res.status(200).json({ message: "Rent Room Votes deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
