const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createTodo)
  .get(authMiddleware, getTodos);
router
  .route("/:id")
  .put(authMiddleware, updateTodo)
  .delete(authMiddleware, deleteTodo);

module.exports = router;
