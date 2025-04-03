import { executeMysqlQuery } from "../config/db";
import ServiceVotes from "../models/serviceVotes";
import { serviceVotesSchema } from "../schemas/serviceVotes";

export const getAllServiceVotes = async (req, res) => {
  try {
    const serviceVotes = await executeMysqlQuery(
      "SELECT * FROM ServiceVotes WHERE Deleted = 0"
    );
    if (serviceVotes.length === 0) {
      res.status(404).send("No service votes found");
    } else {
      res.send(serviceVotes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceVotesById = async (req, res) => {
  try {
    const serviceVotesId = req.params.id;
    const serviceVotes = await executeMysqlQuery(
      "SELECT * FROM ServiceVotes WHERE ServiceVotesId =?",
      [serviceVotesId]
    );
    if (serviceVotes.length === 0) {
      res.status(404).send("No service votes found for this service");
    } else {
      res.send(serviceVotes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createServiceVotes = async (req, res) => {
  try {
    const serviceVote = new ServiceVotes(req.body);
    const { error } = serviceVotesSchema.validate(serviceVote, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const result = await executeMysqlQuery(
      "INSERT INTO ServiceVotes (ServiceId, UserId, Quantity, TotalAmount, Deleted) VALUES (?, ?, ?, ?, ?)",
      [
        serviceVote.ServiceId,
        serviceVote.UserId,
        serviceVote.Quantity,
        serviceVote.TotalAmount,
        serviceVote.Deleted,
      ]
    );
    if (result.affectedRows > 0) {
      res.status(201).send("Service vote created successfully");
    } else {
      res.status(400).send("Failed to create service vote");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateServiceVotes = async (req, res) => {
  try {
    const { error } = serviceVotesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const result = await executeMysqlQuery(
      "UPDATE ServiceVotes SET ServiceId = ?, UserId=?, Quantity = ?, TotalAmount = ?, Deleted = ? WHERE ServiceVotesId = ?",
      [
        req.body.ServiceId,
        req.body.UserId,
        req.body.Quantity,
        req.body.TotalAmount,
        req.body.Deleted,
        req.body.ServiceVotesId,
      ]
    );
    if (result.affectedRows > 0) {
      res.status(200).send("Service vote updated successfully");
    } else {
      res.status(404).send("Service vote not found");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteServiceVotes = async (req, res) => {
  try {
    const serviceVoteId = req.params.id;
    const result = await executeMysqlQuery(
      "UPDATE ServiceVotes SET Deleted = 1 WHERE ServiceVotesId =?",
      [serviceVoteId]
    );
    if (result.affectedRows > 0) {
      res.status(200).send("Service vote deleted successfully");
    } else {
      res.status(404).send("Service vote not found");
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};
