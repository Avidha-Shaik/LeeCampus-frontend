import axios from "axios";

const BASE = "http://localhost:8081/leecampus/admin";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const adminLogin = (data) =>
  axios.post(`${BASE}/login`, data);

export const adminGetStudents = () =>
  axios.get(`${BASE}/students`, authHeader());

export const adminDeleteStudent = (id) =>
  axios.delete(`${BASE}/students/${id}`, authHeader());

export const adminRefreshStats = (id) =>
  axios.post(`${BASE}/refresh/${id}`, {}, authHeader());

export const adminRefreshAll = () =>
  axios.post(`${BASE}/refreshAll`, {}, authHeader());

export const adminGetStats = () =>
  axios.get(`${BASE}/stats`, authHeader());

export const adminRegisterFaculty = (data) =>
  axios.post(
    "http://localhost:8081/leecampus/faculty/register",
    data,
    authHeader()
  );

export const adminGetAnalytics = (params = {}) => {
  const query = new URLSearchParams();
  if (params.department) query.append("department", params.department);
  if (params.section)    query.append("section",    params.section);
  if (params.year)       query.append("year",        params.year);
  const qs = query.toString();
  return axios.get(`${BASE}/analytics${qs ? `?${qs}` : ""}`, authHeader());
};