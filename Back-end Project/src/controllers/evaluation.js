import { executeMysqlQuery } from "../config/db";
import Evaluation from "../models/evaluation";
import { evaluationSchema } from "../schemas/evaluation";

export const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await executeMysqlQuery(
      "SELECT * FROM Evaluation WHERE Deleted = 0"
    );
    res.send(evaluations);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const getEvaluationById = async (req, res) => {
  try {
    const id = req.params.id;
    const evaluation = await executeMysqlQuery(
      "SELECT * FROM Evaluation WHERE EvaluationId = ?",
      [id]
    );
    if (evaluation.length === 0) {
      res.status(404).send({ message: "Evaluation not found" });
    } else {
      res.send(evaluation[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

export const createEvaluation = async (req, res) => {
  try {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { EvaluationId, UserId, RoomId, Rating, Comment, Status, Deleted } =
      req.body;
    const query = `
      INSERT INTO Evaluation (EvaluationId, UserId, RoomId, Rating, Comment, Status, Deleted) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await executeMysqlQuery(query, [
      EvaluationId,
      UserId,
      RoomId,
      Rating,
      Comment,
      Status,
      Deleted,
    ]);

    if (result.affectedRows === 0) {
      res.status(400).json({ message: "Failed to create evaluation" });
    } else {
      res.status(200).json({
        message: "Create evaluation successfully",
        EvaluationId: result.insertId,
      });
    }

    // Example result:
    //   {
    //     "fieldCount": 0,
    //     "affectedRows": 1,
    //     "insertId": 1,
    //     "info": "",
    //     "serverStatus": 2,
    //     "warningStatus": 0,
    //     "changedRows": 0
    // }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const id = req.params.id;
    const { UserId, RoomId, Rating, Comment, Status, Deleted } = req.body;
    const query = `
      UPDATE Evaluation 
      SET UserId = ?, RoomId = ?, Rating = ?, Comment = ?, Status = ?, Deleted = ? 
      WHERE EvaluationId = ?
    `;
    const result = await executeMysqlQuery(query, [
      UserId,
      RoomId,
      Rating,
      Comment,
      Status,
      Deleted,
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Evaluation not found" });
    } else {
      res.status(200).json({ message: "Evaluation updated successfully" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await executeMysqlQuery(
      "UPDATE Evaluation SET Deleted = 1 WHERE EvaluationId =?",
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).send({ message: "Evaluation not found" });
    } else {
      res.status(200).send({ message: "Evaluation deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
