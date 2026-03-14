import axios from "axios";

const BASE_URL = "http://localhost:8081/leecampus";

export const registerStudent = (data) =>
  axios.post(`${BASE_URL}/registerStudent`, data);

export const loginStudent = (data) =>
  axios.post(`${BASE_URL}/login`, data);

export const getStudentById = (id) =>
  axios.get(`${BASE_URL}/getStudent/${id}`);

export const getAllStudents = () =>
  axios.get(`${BASE_URL}/allStudents`);

export const updateStudent = (id, data) =>
  axios.put(`${BASE_URL}/updateStudent/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE_URL}/deleteStudent/${id}`);

export const registerBulk = (data) =>
  axios.post(`${BASE_URL}/registerBulk`, data);