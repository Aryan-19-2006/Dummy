
const db = require("../config/db");

exports.list = async (req, res) => {
  const [students] = await db.execute(`
    SELECT s.id, s.user_id, s.roll_number, s.course,
           s.semester, s.phone, u.name, u.email
    FROM students s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.id DESC
  `);

  res.json({ success: true, students });
};

exports.getOne = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT s.id, s.user_id, s.roll_number, s.course,
            s.semester, s.phone, u.name, u.email
     FROM students s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE s.id = ?`,
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.json({ success: true, student: rows[0] });
};

exports.create = async (req, res) => {
  const { user_id, roll_number, course, semester, phone } = req.body;

  if (
    !roll_number?.trim() ||
    !course?.trim() ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 12
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid roll number, course and semester are required"
    });
  }

  const [result] = await db.execute(
    `INSERT INTO students
       (user_id, roll_number, course, semester, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [
      user_id || null,
      roll_number.trim(),
      course.trim(),
      Number(semester),
      phone || null
    ]
  );

  res.status(201).json({
    success: true,
    message: "Student created",
    id: result.insertId
  });
};

exports.update = async (req, res) => {
  const { roll_number, course, semester, phone } = req.body;

  if (
    !roll_number?.trim() ||
    !course?.trim() ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 12
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid roll number, course and semester are required"
    });
  }

  const [result] = await db.execute(
    `UPDATE students
     SET roll_number = ?, course = ?, semester = ?, phone = ?
     WHERE id = ?`,
    [
      roll_number.trim(),
      course.trim(),
      Number(semester),
      phone || null,
      req.params.id
    ]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.json({ success: true, message: "Student updated" });
};

exports.remove = async (req, res) => {
  const [result] = await db.execute(
    "DELETE FROM students WHERE id = ?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.json({ success: true, message: "Student deleted" });
};
