// src/router/index.tsx
import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import HomeLayout from "../layouts/HomeLayout";
import CameraPage from "../pages/CameraPage.tsx";
import AlertsPage from "../pages/AlertsPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "/home",
                element: <HomePage/>,
            },
            {
                path: "/cameras",
                element: <CameraPage/>, // Placeholder for Cameras Page
            },
            {
                path: "/alerts",
                element: <AlertsPage/>, // Placeholder for Alerts Page
            },
            {
                path: "/reports",
                element: <ReportsPage/>, // Placeholder for Reports Page
            },
            {
                path: "/settings",
                element: <SettingsPage/>, // Placeholder for Settings Page
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/signup",
        element: <SignupPage/>,
    },
]);
