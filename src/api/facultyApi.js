import axios from "axios";

const BASE = "http://localhost:8081/leecampus/faculty";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const facultyLogin = (data) =>
  axios.post(`${BASE}/login`, data);

export const facultyGetProfile = (id) =>
  axios.get(`${BASE}/profile/${id}`, authHeader());

export const facultyGetStudents = (department, section = "", year = "") => {
  const params = new URLSearchParams({ department });
  if (section) params.append("section", section);
  if (year) params.append("year", year);
  return axios.get(`${BASE}/students?${params}`, authHeader());
};

export const facultyGetSummary = (department) =>
  axios.get(`${BASE}/summary?department=${department}`, authHeader());

export const facultyGetAnalytics = (department) =>
  axios.get(
    `http://localhost:8081/leecampus/admin/analytics`,
    authHeader()
  );