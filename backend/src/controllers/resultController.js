
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
    `SELECT id, student_id, subject, marks,
            max_marks, exam_type
     FROM results WHERE student_id = ?
     ORDER BY subject`,
    [studentId]
  );

  res.json({ success: true, results: rows });
};

exports.create = async (req, res) => {
  const { student_id, subject, marks, max_marks, exam_type } = req.body;
  const obtained = Number(marks);
  const maximum = Number(max_marks);

  if (
    !student_id ||
    !subject?.trim() ||
    !Number.isFinite(obtained) ||
    !Number.isFinite(maximum) ||
    maximum <= 0 ||
    obtained < 0 ||
    obtained > maximum
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid marks data"
    });
  }

  const [result] = await db.execute(
    `INSERT INTO results
       (student_id, subject, marks, max_marks, exam_type)
     VALUES (?, ?, ?, ?, ?)`,
    [
      student_id,
      subject.trim(),
      obtained,
      maximum,
      exam_type || "Internal"
    ]
  );

  res.status(201).json({
    success: true,
    message: "Result saved",
    id: result.insertId
  });
};
