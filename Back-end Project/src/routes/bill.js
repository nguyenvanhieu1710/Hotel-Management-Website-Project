import express from "express";

const router = express.Router();

router.get("/bill/get-all", (req, res) => {
  res.send("All bills");
});

router.get("/bill/get-data-by-id/:id", (req, res) => {
  res.send(`Bill with id: ${req.params.id}`);
});

router.post("/bill/create", (req, res) => {
  res.send("Bill created");
});

router.put("/bill/update", (req, res) => {
  res.send("Bill updated");
});

router.delete("/bill/delete/:id", (req, res) => {
  res.send(`Bill with id: ${req.params.id} deleted`);
});

export default router;
