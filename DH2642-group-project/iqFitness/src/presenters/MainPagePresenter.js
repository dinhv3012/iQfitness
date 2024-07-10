import React from "react";
import { useSelector } from "react-redux";
import MainPageView from "../views/MainPageView";

const MainPage = () => {

    const userInfo = useSelector((state) => state.user.userInfo);


    const handleIQWorkoutsClick = () => {
        window.location.href = "/workouts";
    };

    const handleLogWorkoutClick = () => {
        window.location.href = "/log";
    };

    const handleProfilePageClick = () => {
        window.location.href = "/profile";
    };

    const handleIQHistoryClick = () => {
        window.location.href = "/history/workouts";
    };

    return <div>
        <MainPageView
            userInfo={userInfo}
            onIQWorkoutsClick={handleIQWorkoutsClick}
            onLogWorkoutClick={handleLogWorkoutClick}
            onProfilePageClick={handleProfilePageClick}
            onIQHistoryClick={handleIQHistoryClick}
        />
    </div>;
};

export default MainPage;
