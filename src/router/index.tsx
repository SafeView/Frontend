// src/router/index.tsx

import { createBrowserRouter } from "react-router-dom";

// ✅ 페이지 컴포넌트 불러오기
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import HomeLayout from "../layouts/HomeLayout"; // 공통 레이아웃 (Header + Sidebar)
import CameraPage from "../pages/CameraPage.tsx";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import AnalysisPage from "../pages/AnalysisPage.tsx";
import VerificationPage from "../pages/VerificationPage.tsx";

// ✅ 라우터 설정
export const router = createBrowserRouter([
    {
        path: "/",                      // 최상위 경로
        element: <HomeLayout />,        // 모든 내부 페이지에 적용할 공통 레이아웃
        children: [                    // 자식 라우팅 (공통 레이아웃 아래 포함됨)
            {
                index: true,           // "/" 경로일 때 기본 페이지로 설정
                element: <HomePage />,
            },
            {
                path: "/home",         // "/home"도 동일하게 HomePage
                element: <HomePage />,
            },
            {
                path: "/cameras",      // 📷 카메라 페이지
                element: <CameraPage />,
            },
            {
                path: "/analysis",     // 📊 영상 분석 페이지
                element: <AnalysisPage />,
            },
            {
                path: "/reports",      // 📈 보고서 페이지
                element: <ReportsPage />,
            },
            {
                path: "/settings",     // ⚙️ 설정 페이지
                element: <SettingsPage />,
            },
            {
                path: "/verification", // 🔐 키 검증 및 권한 요청 페이지
                element: <VerificationPage />,
            },
        ],
    },
    {
        path: "/login",                // 로그인 페이지 (레이아웃 없이 단독 진입)
        element: <LoginPage />,
    },
    {
        path: "/signup",              // 회원가입 페이지 (레이아웃 없이 단독 진입)
        element: <SignupPage />,
    },
]);
