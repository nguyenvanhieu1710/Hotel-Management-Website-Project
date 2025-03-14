import { executeMysqlQuery } from "../config/db.js";
import EventType from "../models/eventType.js";
import { eventTypeSchema } from "./../schemas/eventType";

export const getAllEventType = async (req, res) => {
  try {
    const eventTypes = await executeMysqlQuery("SELECT * FROM EventType");
    if (eventTypes.length === 0) {
      res.status(404).send("No event types found");
    } else {
      res.send(eventTypes);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getEventTypeById = async (req, res) => {
  try {
    const eventTypeId = req.params.id;
    const eventType = await executeMysqlQuery(
      `SELECT * FROM EventType WHERE EventTypeID = ${eventTypeId}`
    );
    if (eventType.length === 0) {
      res.status(404).send("No event type found");
    } else {
      res.send(eventType[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createEventType = async (req, res) => {
  try {
    const eventType = new EventType(req.body);
    // abortEarly: false là toàn bộ danh sách lỗi validate
    const { error } = eventTypeSchema.validate(eventType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO EventType (EventTypeName, Description, Deleted) VALUES (?, ?, ?)`,
      [
        eventType.EventTypeName,
        eventType.Description,
        eventType.Deleted,
      ]
    );
    res.status(200).json({ message: "Create event type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateEventType = async (req, res) => {
  try {
    const eventType = new EventType(req.body);
    const { error } = eventTypeSchema.validate(eventType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE EventType 
       SET EventTypeName = ?, Description = ?, Deleted = ? 
       WHERE EventTypeID = ?`,
      [
        eventType.EventTypeName,
        eventType.Description,
        eventType.Deleted,
        eventType.EventTypeId,
      ]
    );    
    res.status(200).json({ message: "Update event type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteEventType = async (req, res) => {
  try {
    const eventTypeId = req.params.id;
    await executeMysqlQuery(
      `DELETE FROM EventType WHERE EventTypeID = ${eventTypeId}`
    );
    res.status(200).json({ message: "Delete EventType successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
