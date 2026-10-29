
CREATE DATABASE IF NOT EXISTS student_erp;
USE student_erp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (
        student_id, subject, attendance_date
    )
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100,
    exam_type VARCHAR(50) DEFAULT 'Internal',
    FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
    CHECK (marks >= 0 AND marks <= max_marks),
    CHECK (max_marks > 0)
);

CREATE TABLE timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    day_of_week ENUM(
        'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    CHECK (end_time > start_time)
);

CREATE INDEX idx_attendance_student
    ON attendance(student_id);

CREATE INDEX idx_results_student
    ON results(student_id);

CREATE INDEX idx_timetable_course
    ON timetable(course, semester);
