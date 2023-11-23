import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./auth-context";

const privateNotebookAPIInstance = axios.create({
  baseURL: "https://localhost:7090/api/"
});

privateNotebookAPIInstance.interceptors.request.use(
  async (config) => {
    var jwtToken = localStorage.getItem('jwtToken')
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    return config;  
  }
)

export default privateNotebookAPIInstance