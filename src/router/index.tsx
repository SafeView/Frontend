// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import LivePage from "../pages/LivePage.tsx";
import HomeLayout from "../layouts/HomeLayout";
import CameraPage from "../pages/CameraPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/live",
        element: <LivePage />,
      },
      {
        path: "/cameras",
        element: <CameraPage />, // Placeholder for Cameras Page
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);
