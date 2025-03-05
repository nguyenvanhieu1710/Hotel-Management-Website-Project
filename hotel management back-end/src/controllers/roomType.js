import { executeQuery, closeSQLConnection } from "./../config/db";
import RoomType from "./../models/roomType";
import { roomTypeSchema } from "./../schemas/roomType";

export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await executeQuery("SELECT * FROM RoomType");
    if (roomTypes.length === 0) {
      res.status(404).send("No room types found");
    } else {
      res.send(roomTypes);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getRoomTypeById = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const roomType = await executeQuery(
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
  } finally {
    await closeSQLConnection();
  }
};

export const createRoomType = async (req, res) => {
  try {
    const roomType = new RoomType(req.body);
    // abortEarly: false là toàn bộ danh sách lỗi validate
    const { error } = roomTypeSchema.validate(roomType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeQuery(
      `INSERT INTO RoomType (RoomTypeName, MaximumNumberOfGuests, Description, Deleted) VALUES (@RoomTypeName, @MaximumNumberOfGuests, @Description, @Deleted)`,
      {
        RoomTypeName: roomType.RoomTypeName,
        MaximumNumberOfGuests: roomType.MaximumNumberOfGuests,
        Description: roomType.Description,
        Deleted: roomType.Deleted,
      }
    );
    res.status(200).json({ message: "Create room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
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
    await executeQuery(
      `UPDATE RoomType SET RoomTypeName = @RoomTypeName, MaximumNumberOfGuests = @MaximumNumberOfGuests, Description = @Description, Deleted = @Deleted WHERE RoomTypeID = @RoomTypeID`,
      {
        RoomTypeID: roomType.RoomTypeID,
        RoomTypeName: roomType.RoomTypeName,
        MaximumNumberOfGuests: roomType.MaximumNumberOfGuests,
        Description: roomType.Description,
        Deleted: roomType.Deleted,
      }
    );
    res.status(200).json({ message: "Update room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const deleteRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    await executeQuery(`DELETE FROM RoomType WHERE RoomTypeID = ${roomTypeId}`);
    res.status(200).json({ message: "Delete room type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};
