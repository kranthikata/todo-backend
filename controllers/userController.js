const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const db = req.app.get("db");

  try {
    const user = await db.get(
      `SELECT id, name, email FROM users WHERE id = ?`,
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user profile. Please try again.",
    });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const db = req.app.get("db");
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({
      error:
        "At least one field (name, email, or password) must be provided to update the profile.",
    });
  }

  try {
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [
      req.user.userId,
    ]);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // If password is provided, hash it
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await db.run(
      `UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), password = ? WHERE id = ?`,
      [name, email, hashedPassword, req.user.userId]
    );

    res.status(200).json({
      message: "User profile updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update user profile. Please try again.",
    });
  }
};

// Delete User Profile
exports.deleteUserProfile = async (req, res) => {
  const db = req.app.get("db");

  try {
    await db.run(`DELETE FROM users WHERE id = ?`, [req.user.userId]);

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete user profile. Please try again.",
    });
  }
};
