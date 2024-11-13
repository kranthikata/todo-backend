const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userSignup = async (req, res) => {
  const db = req.app.get("db");
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  try {
    await db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
      [userId, name, email, hashedPassword]
    );
    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    res.status(400).json({
      error: "User already exits",
    });
  }
};

const userLogin = async (req, res) => {
  const db = req.app.get("db");
  const { email, password } = req.body;

  try {
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (user) {
      const isPasswordSame = await bcrypt.compare(password, user.password);
      if (isPasswordSame) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "10d",
        });
        res.json({ token, user });
      } else {
        res.status(400).json({
          error: "Invalid user credentials",
        });
      }
    } else {
      res.status(400).json({
        error: "Invalid user credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { userLogin, userSignup };
