import axios from "axios";
import { TokenStorage } from "../utils/tokenStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터: 자동으로 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 시도
        const refreshToken = TokenStorage.getRefreshToken();
        if (refreshToken) {
          // refreshToken API 호출 로직 추가 가능
          // const newToken = await refreshTokenAPI(refreshToken);
          // TokenStorage.setAccessToken(newToken);
          // return API(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        TokenStorage.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);