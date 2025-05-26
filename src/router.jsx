import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import DetectionLayout from "./components/layouts/DetectionLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AuthLayout from "./components/layouts/AuthLayout";

import HomePage from "./pages/home/HomePage";
import DetectionPage from "./pages/home/DetectionPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HistoryPage from './pages/history/HistoryPage';
import DiseaseManagement from "./pages/dashboard/DiseaseManagement";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UserManagement from "./pages/dashboard/UserManagement";
import DiseaseDetail from "./components/dashboard/DiseaseDetail";
import UserDetail from "./components/dashboard/UserDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/detection",
    element: <DetectionLayout />,
    children: [
      {
        index: true,
        element: <DetectionPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "disease-management",
        element: <DiseaseManagement />,
        children: [
          {
            path: ":id",
            element: <DiseaseDetail />,
          },
        ],
      },
      {
        path: "user-management",
        element: <UserManagement />,
        children: [
          {
            path: ":id",
            element: <UserDetail />,
          },
        ]
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
]);