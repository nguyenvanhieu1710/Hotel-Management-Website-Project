import express from "express";

const router = express.Router();

router.get("/service-votes/get-all", (req, res) => {
  res.send("get all service votes");
});

router.get("/service-votes/get-data-by-id/:id", (req, res) => {
  res.send("get data by id");
});

router.post("/service-votes/create", (req, res) => {
  res.send("create service votes");
});

router.put("/service-votes/update", (req, res) => {
  res.send("update service votes");
});

router.delete("/service-votes/delete/:id", (req, res) => {
  res.send("delete service votes");
});
export default router;
