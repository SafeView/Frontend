import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 기반 인증을 위해 항상 포함
});

export default api;

// // 요청 인터셉터: 자동으로 토큰 추가
// API.interceptors.request.use(
//   (config) => {
//     const token = TokenStorage.getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
//
// // 응답 인터셉터: 토큰 만료 시 자동 갱신
// API.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       try {
//         // 토큰 갱신 시도
//         const refreshToken = TokenStorage.getRefreshToken();
//         if (refreshToken) {
//           // refreshToken API 호출 로직 추가 가능
//           // const newToken = await refreshTokenAPI(refreshToken);
//           // TokenStorage.setAccessToken(newToken);
//           // return API(originalRequest);
//         }
//       } catch (refreshError) {
//         // 토큰 갱신 실패 시 로그아웃
//         TokenStorage.clearTokens();
//         window.location.href = '/login';
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );
