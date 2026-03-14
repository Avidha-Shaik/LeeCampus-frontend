import axios from "axios";

const BASE_URL = "http://localhost:8081/leecampus/dashboard";

export const getOverall = (page = 0, size = 10) =>
  axios.get(`${BASE_URL}/overall?page=${page}&size=${size}`);

export const getByYear = (year, page = 0, size = 10) =>
  axios.get(`${BASE_URL}/year/${year}?page=${page}&size=${size}`);

export const getByCourse = (course, page = 0, size = 10) =>
  axios.get(`${BASE_URL}/course/${course}?page=${page}&size=${size}`);

export const getByDepartment = (department, page = 0, size = 10) =>
  axios.get(`${BASE_URL}/department/${department}?page=${page}&size=${size}`);

export const getFullFilter = (year, course, department, section, page = 0, size = 10) =>
  axios.get(
    `${BASE_URL}/year/${year}/course/${course}/department/${department}/section/${section}?page=${page}&size=${size}`
  );

export const searchStudents = (query, page = 0, size = 10) =>
  axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);

// 🔥 My Rank — returns { rank, page } for the logged-in student under current filter
export const getMyRank = (studentId, filterType = "overall", filterValue = "", size = 10) =>
  axios.get(`${BASE_URL}/my-rank`, {
    params: { studentId, filterType, filterValue, size },
  });