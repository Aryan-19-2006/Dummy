
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password (minimum 8 characters) are required"
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 12);

  const [result] = await db.execute(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'student')`,
    [name.trim(), normalizedEmail, hashedPassword]
  );

  res.status(201).json({
    success: true,
    message: "Account created",
    userId: result.insertId
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const [users] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email.trim().toLowerCase()]
  );

  if (
    !users.length ||
    !(await bcrypt.compare(password, users[0].password))
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const user = users[0];

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

exports.me = async (req, res) => {
  const [users] = await db.execute(
    `SELECT id, name, email, role
     FROM users WHERE id = ?`,
    [req.user.id]
  );

  if (!users.length) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({ success: true, user: users[0] });
};
