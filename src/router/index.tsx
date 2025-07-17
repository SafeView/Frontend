// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HomeLayout from "../layout/HomeLayout";
import LiveListPage from "../pages/live/LiveListPage";
import LiveCameraPage from "../pages/live/LiveCameraPage";

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
        path: "home",
        element: <HomePage />,
      },
      {
        path: 'live',
        element: <LiveListPage />,
      },
      {
        path: 'live/:cameraId',
        element: <LiveCameraPage />,
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
