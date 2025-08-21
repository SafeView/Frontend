// axios 라이브러리 import (HTTP 요청을 보낼 수 있는 클라이언트)
import axios from 'axios';

// axios 인스턴스를 생성해서 공통 설정을 적용한 객체 생성
const api = axios.create({
    // 모든 요청의 기본 URL 설정 (백엔드 API 서버의 기본 주소)
    baseURL: 'http://localhost:8080/api',

    // 요청 헤더 설정: JSON 형식으로 데이터를 보낼 것이라는 의미
    headers: {
        'Content-Type': 'application/json',
    },

    // 쿠키를 포함하여 요청할 수 있도록 설정
    // 백엔드에서 세션 기반 인증 또는 쿠키 기반 인증 시 필요
    withCredentials: true,
});

// 생성한 axios 인스턴스를 외부에서 사용할 수 있도록 export
export default api;
