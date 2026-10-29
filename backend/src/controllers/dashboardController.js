
const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  let studentId = null;

  if (req.user.role === "student") {
    const [students] = await db.execute(
      "SELECT id FROM students WHERE user_id = ?",
      [req.user.id]
    );

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    studentId = students[0].id;
  }

  const [studentCount] = await db.execute(
    "SELECT COUNT(*) AS total FROM students"
  );

  const [attendanceStats] = studentId
    ? await db.execute(
        `SELECT
           COUNT(*) AS total,
           COALESCE(SUM(status = 'present'), 0) AS present
         FROM attendance WHERE student_id = ?`,
        [studentId]
      )
    : await db.execute(
        `SELECT COUNT(*) AS total,
           COALESCE(SUM(status = 'present'), 0) AS present
         FROM attendance`
      );

  const [resultStats] = studentId
    ? await db.execute(
        `SELECT COUNT(*) AS total,
           ROUND(AVG(marks / max_marks * 100), 2) AS average
         FROM results WHERE student_id = ?`,
        [studentId]
      )
    : await db.execute(
        `SELECT COUNT(*) AS total,
           ROUND(AVG(marks / max_marks * 100), 2) AS average
         FROM results`
      );

  const attendance = attendanceStats[0];
  const attendancePercentage = Number(attendance.total)
    ? Number((attendance.present / attendance.total * 100).toFixed(2))
    : 0;

  res.json({
    success: true,
    stats: {
      totalStudents: req.user.role === "admin"
        ? studentCount[0].total
        : 1,
      attendancePercentage,
      totalResults: resultStats[0].total,
      averageMarksPercentage: Number(resultStats[0].average || 0)
    }
  });
};
