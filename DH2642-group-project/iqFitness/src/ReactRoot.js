import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import "./views/Styled.css";
import IqChat from "./presenters/IqChatPresenter";
import IqWorkouts from "./presenters/IqWorkoutsPresenter";
import AddNewInput from "./presenters/AddNewInputPresenter";
import IqWorkoutsAdd from "./presenters/IqWorkoutsAddPresenter";
import Login from "./presenters/LoginPresenter";
import ProfilePage from "./presenters/ProfilePagePresenter";
import WorkoutsHistory from "./presenters/WorkoutsHistoryPresenter";
import Sidebar from "./components/Sidebar";
import Register from "./presenters/RegisterPresenter";
import { useSelector } from "react-redux";
import FrontPage from "./presenters/FrontPagePresenter";
import MainPage from "./presenters/MainPagePresenter";


function ReactRoot() {
  const currentUser = useSelector((state) => state.user.userCredentials ? state.user.userCredentials : null)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const LoggedInAuth = ({ children }) => {
    return currentUser ? <Navigate to="/" /> : children;
  };

  const MainOrFrontPage = () => {
    return currentUser ? <MainPage /> : <FrontPage />
  }

  const router = createBrowserRouter([
    { path: "/", element: MainOrFrontPage() },
    { path: "/login", element: <Login /> },
    { path: "/profile", element: <RequireAuth><ProfilePage /></RequireAuth> },
    { path: "/workouts", element: <RequireAuth><IqWorkouts /></RequireAuth> },
    { path: "/log", element: <RequireAuth><AddNewInput /></RequireAuth> },
    { path: "/workouts/add", element: <RequireAuth><IqWorkoutsAdd /></RequireAuth> },
    { path: "/iqchat", element: <RequireAuth><IqChat /></RequireAuth> },
    { path: "/history/workouts", element: <RequireAuth><WorkoutsHistory /></RequireAuth> },
    { path: "/register", element: <LoggedInAuth><Register /></LoggedInAuth> },
  ]);


  return (
    <div style={{ width: "100%" }}>
      <Sidebar />
      <RouterProvider router={router} />
      {currentUser && <IqChat />}
    </div>
  );
}

export default ReactRoot;
