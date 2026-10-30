
import {
  CalendarCheck,
  GraduationCap,
  ClipboardList,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import StatCard from "./StatCard";
import {
  student,
  attendance,
  results,
  assignments,
} from "./data/studentData";

export default function Dashboard() {
  const attended = attendance.reduce(
    (sum, item) => sum + item.attended,
    0
  );

  const totalClasses = attendance.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const percentage = Math.round(
    (attended / totalClasses) * 100
  );

  const average = Math.round(
    results.reduce((sum, item) => sum + item.marks, 0) /
      results.length
  );

  const pending = assignments.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">STUDENT OVERVIEW</span>
          <h1>Welcome back, {student.name.split(" ")[0]}!</h1>
          <p>
            Here is your academic progress and campus activity
            for the current semester.
          </p>
          <div className="welcome-meta">
            <span>{student.course}</span>
            <span>•</span>
            <span>{student.semester}</span>
          </div>
        </div>

        <div className="welcome-illustration">
          <GraduationCap size={100} strokeWidth={1.2} />
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Attendance"
          value={`${percentage}%`}
          subtitle="Overall class attendance"
          icon={CalendarCheck}
          color="blue"
        />
        <StatCard
          title="Average Marks"
          value={`${average}%`}
          subtitle="Across listed subjects"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Pending Tasks"
          value={pending}
          subtitle="Assignments to complete"
          icon={ClipboardList}
          color="orange"
        />
        <StatCard
          title="Fee Status"
          value="Partial"
          subtitle="One fee payment pending"
          icon={Wallet}
          color="green"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Attendance Overview</h3>
              <p>Subject-wise attendance records</p>
            </div>
            <span className="small-tag">This semester</span>
          </div>

          <div className="attendance-list">
            {attendance.map((item) => {
              const percent = Math.round(
                (item.attended / item.total) * 100
              );

              return (
                <div className="attendance-item" key={item.subject}>
                  <div className="progress-heading">
                    <span>{item.subject}</span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${
                        percent < 75 ? "warning" : ""
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p>
                    {item.attended} of {item.total} classes attended
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Results</h3>
              <p>Your subject performance</p>
            </div>
            <GraduationCap size={22} className="muted-icon" />
          </div>

          <div className="result-list">
            {results.map((item) => (
              <div className="result-item" key={item.subject}>
                <div className="subject-icon">
                  {item.subject.charAt(0)}
                </div>
                <div className="result-subject">
                  <strong>{item.subject}</strong>
                  <span>{item.marks}/100 marks</span>
                </div>
                <span className="grade-badge">{item.grade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel assignments-panel">
          <div className="panel-heading">
            <div>
              <h3>Upcoming Assignments</h3>
              <p>Keep track of your deadlines</p>
            </div>
            <ClipboardList size={22} className="muted-icon" />
          </div>

          {assignments.map((item) => (
            <div className="assignment-item" key={item.title}>
              <div className="assignment-marker" />
              <div className="assignment-details">
                <strong>{item.title}</strong>
                <span>{item.subject}</span>
                <small>Due: {item.due}</small>
              </div>
              <span
                className={`status-badge ${
                  item.status === "Submitted" ? "paid" : "pending"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="panel profile-panel">
          <div className="panel-heading">
            <div>
              <h3>Student Information</h3>
              <p>Your academic details</p>
            </div>
          </div>

          <div className="profile-summary">
            <div className="profile-avatar">AS</div>
            <div>
              <h3>{student.name}</h3>
              <p>{student.id}</p>
            </div>
          </div>

          <div className="info-row">
            <span>Department</span>
            <strong>{student.department}</strong>
          </div>
          <div className="info-row">
            <span>Semester</span>
            <strong>{student.semester}</strong>
          </div>
          <div className="info-row">
            <span>Faculty Advisor</span>
            <strong>{student.advisor}</strong>
          </div>

          <p className="profile-note">
            <ArrowUpRight size={16} />
            Details are sample data for this demo.
          </p>
        </div>
      </section>
    </div>
  );
}
