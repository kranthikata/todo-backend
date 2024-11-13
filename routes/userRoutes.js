const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile)
  .delete(authMiddleware, deleteUserProfile);

module.exports = router;
