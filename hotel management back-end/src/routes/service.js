import express from "express";

const router = express.Router();

router.get("/service/get-all", (req, res) => {
  res.send("get all service");
});

router.get("/service/get-data-by-id/:id", (req, res) => {
  res.send("get data by id");
});

router.post("/service/create", (req, res) => {
  res.send("create service");
});

router.put("/service/update", (req, res) => {
  res.send("update service");
});

router.delete("/service/delete/:id", (req, res) => {
  res.send("delete service");
});

export default router;
