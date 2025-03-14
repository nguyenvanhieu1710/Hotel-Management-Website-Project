import { executeMysqlQuery } from "../config/db.js";
import Event from "../models/event.js";
import { eventSchema } from "./../schemas/event";

export const getEvents = async (req, res) => {
  try {
    const events = await executeMysqlQuery("SELECT * FROM Event");
    if (events.length === 0) {
      res.status(404).send("No events found");
    } else {
      res.send(events);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const query = "SELECT * FROM Event WHERE EventId = @EventId";
    const event = await executeMysqlQuery(query, { EventId: eventId });
    if (event.length === 0) {
      res.status(404).send("No event found");
    } else {
      res.send(event[0]);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    // Sử dụng abortEarly: false để trả về toàn bộ danh sách lỗi validate
    const { error } = eventSchema.validate(event, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO Event (
         EventName, 
         EventTypeId, 
         UserId, 
         OrganizationDay, 
         StartTime, 
         EndTime, 
         OrganizationLocation, 
         TotalCost, 
         Status, 
         Description, 
         Deleted
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.EventName,
        event.EventTypeId,
        event.UserId,
        event.OrganizationDay,
        event.StartTime,
        event.EndTime,
        event.OrganizationLocation,
        event.TotalCost,
        event.Status,
        event.Description,
        event.Deleted,
      ]
    );    
    res.status(200).json({ message: "Create event successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { error } = eventSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const event = new Event(req.body);
    await executeMysqlQuery(
      `UPDATE Event 
       SET EventName = ?,
           EventTypeId = ?,
           UserId = ?,
           OrganizationDay = ?,
           StartTime = ?,
           EndTime = ?,
           OrganizationLocation = ?,
           TotalCost = ?,
           Status = ?,
           Description = ?,
           Deleted = ?
       WHERE EventId = ?`,
      [
        event.EventName,
        event.EventTypeId,
        event.UserId,
        event.OrganizationDay,
        event.StartTime,
        event.EndTime,
        event.OrganizationLocation,
        event.TotalCost,
        event.Status,
        event.Description,
        event.Deleted,
        event.EventId,
      ]
    );    
    res.send("Event updated successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await executeMysqlQuery("DELETE FROM Event WHERE EventId = ?", [eventId]);
    res.send("Event deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  }
};
