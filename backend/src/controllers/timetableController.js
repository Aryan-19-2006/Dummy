
const db = require("../config/db");

exports.list = async (req, res) => {
  const { course, semester } = req.query;

  let sql = `
    SELECT id, course, semester, subject,
           day_of_week, start_time, end_time, room
    FROM timetable
    WHERE 1 = 1
  `;

  const params = [];

  if (course) {
    sql += " AND course = ?";
    params.push(course);
  }

  if (semester) {
    const sem = Number(semester);

    if (!Number.isInteger(sem) || sem < 1 || sem > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester"
      });
    }

    sql += " AND semester = ?";
    params.push(sem);
  }

  sql += ` ORDER BY FIELD(day_of_week,
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'), start_time`;

  const [rows] = await db.execute(sql, params);

  res.json({ success: true, timetable: rows });
};

exports.create = async (req, res) => {
  const {
    course, semester, subject, day_of_week,
    start_time, end_time, room
  } = req.body;

  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  if (
    !course?.trim() ||
    !subject?.trim() ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 12 ||
    !days.includes(day_of_week) ||
    !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(start_time || "") ||
    !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(end_time || "") ||
    start_time >= end_time
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid timetable data"
    });
  }

  const [result] = await db.execute(
    `INSERT INTO timetable
       (course, semester, subject, day_of_week,
        start_time, end_time, room)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      course.trim(), Number(semester), subject.trim(),
      day_of_week, start_time, end_time, room || null
    ]
  );

  res.status(201).json({
    success: true,
    message: "Timetable entry created",
    id: result.insertId
  });
};
