import { executeMysqlQuery } from "../config/db";
import EventVotes from "../models/eventVotes";
import { eventVotesSchema } from "../schemas/eventVotes";

export const getAllEventVotes = async (req, res) => {
  try {
    const eventVotes = await executeMysqlQuery(
      "SELECT * FROM EventVotes WHERE Deleted = 0"
    );
    res.send(eventVotes);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const getEventVotesById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventVotes = await executeMysqlQuery(
      "SELECT * FROM EventVotes WHERE EventVotesId = ? AND Deleted = 0",
      [id]
    );
    if (eventVotes.length === 0) {
      res.status(404).send("No event votes found for this event");
    } else {
      res.send(eventVotes[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const createEventVotes = async (req, res) => {
  try {
    const { error } = eventVotesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const eventVotes = new EventVotes(req.body);

    const query = `
      INSERT INTO EventVotes (EventId, UserId, TotalAmount, Deleted)
      VALUES (?, ?, ?, ?)
    `;

    const result = await executeMysqlQuery(query, [
      eventVotes.EventId,
      eventVotes.UserId,
      eventVotes.TotalAmount,
      eventVotes.Deleted,
    ]);
    if (result.affectedRows > 0) {
      res.status(201).send("Event votes created successfully");
    } else {
      res.status(400).send("Failed to create event votes");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateEventVotes = async (req, res) => {
  try {
    const { error } = eventVotesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { id } = req.params;
    const { eventId, userId, totalAmount, deleted } = req.body;

    const query = `
      UPDATE EventVotes
      SET EventId = ?, 
          UserId = ?, 
          TotalAmount = ?, 
          Deleted = ?
      WHERE EventVotesId = ?
    `;

    const result = await executeMysqlQuery(query, [
      eventId,
      userId,
      totalAmount,
      deleted,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.send("Event votes updated successfully");
    } else {
      res.status(404).send("No event votes found for this event");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteEventVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
                UPDATE EventVotes
                SET Deleted = 1
                WHERE EventVotesId =?
            `;
    const result = await executeMysqlQuery(query, [id]);
    if (result.affectedRows > 0) {
      res.send("Event votes deleted successfully");
    } else {
      res.status(404).send("No event votes found for this event");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};
