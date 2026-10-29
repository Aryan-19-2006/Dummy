
const db = require("../config/db");

exports.list = async (req, res) => {
  const studentId = req.params.studentId;

  if (req.user.role !== "admin") {
    const [own] = await db.execute(
      "SELECT id FROM students WHERE id = ? AND user_id = ?",
      [studentId, req.user.id]
    );

    if (!own.length) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
  }

  const [rows] = await db.execute(
    `SELECT id, student_id, subject,
            attendance_date, status
     FROM attendance
     WHERE student_id = ?
     ORDER BY attendance_date DESC`,
    [studentId]
  );

  const total = rows.length;
  const present = rows.filter(
    row => row.status === "present"
  ).length;

  res.json({
    success: true,
    attendance: rows,
    summary: {
      total,
      present,
      percentage: total
        ? Number((present / total * 100).toFixed(2))
        : 0
    }
  });
};

exports.create = async (req, res) => {
  const { student_id, subject, attendance_date, status } = req.body;

  if (
    !student_id ||
    !subject?.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(attendance_date || "") ||
    !["present", "absent", "late"].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid attendance data"
    });
  }

  const [result] = await db.execute(
    `INSERT INTO attendance
       (student_id, subject, attendance_date, status)
     VALUES (?, ?, ?, ?)`,
    [student_id, subject.trim(), attendance_date, status]
  );

  res.status(201).json({
    success: true,
    message: "Attendance recorded",
    id: result.insertId
  });
};
