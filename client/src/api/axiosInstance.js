import axios from "axios";

const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
