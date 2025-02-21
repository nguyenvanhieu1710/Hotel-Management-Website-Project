import { executeQuery, closeSQLConnection } from "../config/db.js";
import Event from "../models/event.js";
import { eventSchema } from "./../schemas/event";

export const getEvents = async (req, res) => {
  try {
    const events = await executeQuery("SELECT * FROM Event");
    if (events.length === 0) {
      res.status(404).send("No events found");
    } else {
      res.send(events);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await executeQuery("SELECT * FROM Event WHERE EventId = ?", [
      eventId,
    ]);
    if (event.length === 0) {
      res.status(404).send("No event found");
    } else {
      res.send(event[0]);
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const createEvent = async (req, res) => {
  try {
    const { error } = eventSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const event = new Event(req.body);
    await executeQuery("INSERT INTO Event SET ?", [event]);
    res.send("Event created successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
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
    await executeQuery("UPDATE Event SET ? WHERE EventId = ?", [
      event,
      eventId,
    ]);
    res.send("Event updated successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await executeQuery("DELETE FROM Event WHERE EventId = ?", [eventId]);
    res.send("Event deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(err.message);
  } finally {
    await closeSQLConnection();
  }
};
