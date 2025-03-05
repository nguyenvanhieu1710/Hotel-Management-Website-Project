import express from "express";

const router = express.Router();

router.get("/rooms", (req, res) => {
  res.send("All rooms");
});

router.get("/rooms/:id", (req, res) => {
  res.send(`Room with id: ${req.params.id}`);
});

router.post("/rooms/create", (req, res) => {
  res.send("Room created");
});

router.put("/rooms/update/:id", (req, res) => {
  res.send(`Room with id: ${req.params.id} updated`);
});

router.delete("/rooms/delete/:id", (req, res) => {
  res.send(`Room with id: ${req.params.id} deleted`);
});

export default router;
