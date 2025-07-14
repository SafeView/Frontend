import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // 필요 시 수정
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
