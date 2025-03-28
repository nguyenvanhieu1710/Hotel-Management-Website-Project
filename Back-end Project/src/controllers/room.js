import { executeMysqlQuery } from "../config/db";
import Room from "../models/room";
import { roomSchema } from "../schemas/room";

export const getAllRooms = async (req, res) => {
  try {
    const result = await executeMysqlQuery(
      "SELECT * FROM Room WHERE Deleted = 0"
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await executeMysqlQuery(
      "SELECT * FROM Room WHERE RoomId = ?",
      [id]
    );
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const { error } = roomSchema.validate(room, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      "INSERT INTO Room (RoomTypeId, RoomImage, Price, NumberOfFloor, Status, Description, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        room.RoomTypeId,
        room.RoomImage,
        room.Price,
        room.NumberOfFloor,
        room.Status,
        room.Description,
        room.Deleted,
      ]
    );
    res.status(200).json("Room created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const { error } = roomSchema.validate(room, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      "UPDATE Room SET RoomTypeId =?, RoomImage =?, Price =?, NumberOfFloor =?, Status =?, Description =?, Deleted =? WHERE RoomId =?",
      [
        room.RoomTypeId,
        room.RoomImage,
        room.Price,
        room.NumberOfFloor,
        room.Status,
        room.Description,
        room.Deleted,
        room.RoomId,
      ]
    );
    res.status(200).json("Room updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await executeMysqlQuery("UPDATE Room SET Deleted = 1 WHERE RoomId = ?", [
      id,
    ]);
    res.status(200).json("Room deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
