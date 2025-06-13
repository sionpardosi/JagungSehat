import { createBrowserRouter, Navigate } from "react-router-dom"; 

import MainLayout from "./components/layouts/MainLayout";
import DetectionLayout from "./components/layouts/DetectionLayout";
import CameraLayout from "./components/layouts/CameraLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AuthLayout from "./components/layouts/AuthLayout";

import HomePage from "./pages/home/HomePage";
import DetectionPage from "./pages/home/DetectionPage";
import TakePicture from "./pages/home/TakePicture";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HistoryPage from './pages/history/HistoryPage';
import DiseaseManagement from "./pages/dashboard/DiseaseManagement";
import UserManagement from "./pages/dashboard/UserManagement";
import PredictHistory from "./pages/dashboard/PredictHistory";

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
    path: "/detection/take-picture",
    element: <CameraLayout />,
    children: [
      {
        index: true,
        element: <TakePicture />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/disease-management" />, 
      },
      {
        path: "disease-management",
        element: <DiseaseManagement />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "predict-history",
        element: <PredictHistory />,
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