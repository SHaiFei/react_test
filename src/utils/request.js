// src/api/request.ts
import axios from "axios";
import useMessage from "@/utils/useMessage";
import { useNavigate } from "react-router-dom";
// 创建 Axios 实例

const navigate = useNavigate();
const request = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头，比如 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    // const { warning } = useMessage();
    // 统一处理错误，
    const { status, data } = error.response;
    console.log(status, data);
    console.error("API Error:", error);
    if (status === 401 || status === 403 || status === 408) {
      localStorage.clear();
      navigate("/login"); // 使用 React Router 跳转
    }
    return Promise.reject(error);
  }
);

export default request;
