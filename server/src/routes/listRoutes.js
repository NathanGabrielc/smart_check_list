const express = require("express");
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require("../controllers/listController");

const router = express.Router();

router.get("/lists", getLists);
router.post("/lists", createList);
router.put("/lists/:id", updateList);
router.delete("/lists/:id", deleteList);

module.exports = router;
