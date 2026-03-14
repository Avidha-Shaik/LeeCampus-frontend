import api from "../config/axiosConfig";

export const getStats = (path = "") => {
  return api.get(`/stats${path}`);
};