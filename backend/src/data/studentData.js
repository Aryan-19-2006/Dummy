
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("erp_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export async function getDashboard() {
  return apiRequest("/dashboard");
}

export async function getAttendance(studentId) {
  return apiRequest(`/attendance/${studentId}`);
}

export async function getResults(studentId) {
  return apiRequest(`/results/${studentId}`);
}

export async function getTimetable(course, semester) {
  const params = new URLSearchParams();

  if (course) params.set("course", course);
  if (semester) params.set("semester", semester);

  const query = params.toString();

  return apiRequest(`/timetable${query ? `?${query}` : ""}`);
}
