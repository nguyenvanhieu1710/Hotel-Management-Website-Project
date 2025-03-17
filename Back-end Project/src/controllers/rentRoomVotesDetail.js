import { executeMysqlQuery } from "../config/db";
import RentRoomVotesDetail from "../models/rentRoomVotesDetail";
import { rentRoomVotesDetailSchema } from "../schemas/rentRoomVotesDetail";

export const getAllRentRoomVotesDetail = async (req, res) => {
  try {
    const rentRoomVotesDetail = await executeMysqlQuery(
      "SELECT * FROM RentRoomVotesDetail"
    );
    res.send(rentRoomVotesDetail);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const getRentRoomVotesDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const rentRoomVotesDetail = await executeMysqlQuery(
      `SELECT * FROM RentRoomVotesDetail WHERE RentRoomVotesDetailId = ${id}`
    );
    if (rentRoomVotesDetail.length === 0) {
      res.status(404).send("No rent room votes detail found");
    } else {
      res.send(rentRoomVotesDetail[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createRentRoomVotesDetail = async (req, res) => {
  try {
    const rentRoomVotesDetail = new RentRoomVotesDetail(req.body);
    const { error } = rentRoomVotesDetailSchema.validate(rentRoomVotesDetail, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const {
      RentRoomVotesId,
      RoomId,
      ServiceVotesId,
      TotalCostOfThisRoom,
      Note,
      Deleted,
    } = rentRoomVotesDetail;

    await executeMysqlQuery(
      `INSERT INTO RentRoomVotesDetail (RentRoomVotesId, RoomId, ServiceVotesId, TotalCostOfThisRoom, Note, Deleted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        RentRoomVotesId,
        RoomId,
        ServiceVotesId,
        TotalCostOfThisRoom,
        Note,
        Deleted,
      ]
    );
    res
      .status(201)
      .send({ message: "RentRoomVotesDetail created successfully." });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateRentRoomVotesDetail = async (req, res) => {
  try {
    const rentRoomVotesDetail = new RentRoomVotesDetail(req.body);
    const { error } = rentRoomVotesDetailSchema.validate(rentRoomVotesDetail, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const {
      RentRoomVotesDetailId,
      RentRoomVotesId,
      RoomId,
      ServiceVotesId,
      TotalCostOfThisRoom,
      Note,
      Deleted,
    } = rentRoomVotesDetail;

    await executeMysqlQuery(
      `UPDATE RentRoomVotesDetail
       SET RentRoomVotesId = ?, RoomId = ?, ServiceVotesId = ?, TotalCostOfThisRoom = ?, Note = ?, Deleted = ?
       WHERE RentRoomVotesDetailId = ?`,
      [
        RentRoomVotesId,
        RoomId,
        ServiceVotesId,
        TotalCostOfThisRoom,
        Note,
        Deleted,
        RentRoomVotesDetailId,
      ]
    );
    res
      .status(200)
      .send({ message: "RentRoomVotesDetail updated successfully." });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteRentRoomVotesDetail = async (req, res) => {
  try {
    const id = req.params.id;
    await executeMysqlQuery(
      `DELETE FROM RentRoomVotesDetail WHERE RentRoomVotesDetailId = ${id}`
    );
    res.send({ message: "RentRoom votes detail deleted successfully." });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
