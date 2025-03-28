import { executeMysqlQuery } from "./../config/db";
import RoomType from "./../models/roomType";
import { roomTypeSchema } from "./../schemas/roomType";

export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await executeMysqlQuery(
      "SELECT * FROM RoomType WHERE Deleted = 0"
    );
    if (roomTypes.length === 0) {
      res.status(404).send("No room types found");
    } else {
      res.send(roomTypes);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getRoomTypeById = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const roomType = await executeMysqlQuery(
      `SELECT * FROM RoomType WHERE RoomTypeID = ${roomTypeId}`
    );
    if (roomType.length === 0) {
      res.status(404).send("No room type found");
    } else {
      res.send(roomType[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createRoomType = async (req, res) => {
  try {
    const roomType = new RoomType(req.body);
    // console.log(roomType);

    // abortEarly: false là toàn bộ danh sách lỗi validate
    const { error } = roomTypeSchema.validate(roomType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO RoomType (RoomTypeName, MaximumNumberOfGuests, Description, Deleted) VALUES (?, ?, ?, ?)`,
      [
        roomType.RoomTypeName,
        roomType.MaximumNumberOfGuests,
        roomType.Description,
        roomType.Deleted,
      ]
    );
    res.status(200).json({ message: "Create room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateRoomType = async (req, res) => {
  try {
    const roomType = new RoomType(req.body);
    const { error } = roomTypeSchema.validate(roomType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE RoomType 
       SET RoomTypeName = ?,
           MaximumNumberOfGuests = ?,
           Description = ?,
           Deleted = ?
       WHERE RoomTypeID = ?`,
      [
        roomType.RoomTypeName,
        roomType.MaximumNumberOfGuests,
        roomType.Description,
        roomType.Deleted,
        roomType.RoomTypeId,
      ]
    );
    res.status(200).json({ message: "Update room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    await executeMysqlQuery(
      `UPDATE RoomType SET Deleted = 1 WHERE RoomTypeID = ${roomTypeId}`
    );
    res.status(200).json({ message: "Delete room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
