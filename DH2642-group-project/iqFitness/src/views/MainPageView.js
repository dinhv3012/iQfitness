import React from "react";
import "./Styled.css";
import { FaDumbbell, FaPlus, FaChartLine, FaUserAlt } from "react-icons/fa";
import { Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";

function MainPageView({
  userInfo,
  onIQWorkoutsClick,
  onLogWorkoutClick,
  onProfilePageClick,
  onIQHistoryClick,
}) {
  return (
    <div className="main-page">
      <div className="content-container">
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h1">
              Welcome, {userInfo.firstName} {userInfo.lastName}!
            </Typography>
            <Typography variant="h5" component="h1" marginTop={2}>
              Time to stay fit, at any time and any place!
            </Typography>
          </Grid>
          <Grid item xs={12} sm={11} md={9} lg={8}>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} marginTop={3}>
              <Grid item xs={6} sm={5}>
                <IconButton className="iq-workouts-button" onClick={onIQWorkoutsClick}>
                  <FaDumbbell size={25} />
                  <Typography variant="h6" component="div" marginTop={1}>
                    IQ WORKOUTS
                  </Typography>
                </IconButton>
              </Grid>

              <Grid item xs={6} sm={5}>
                <IconButton className="log-workout-button" onClick={onLogWorkoutClick}>
                  <FaPlus size={25} />
                  <Typography variant="h6" component="div" marginTop={1}>
                    LOG WORKOUT
                  </Typography>
                </IconButton>

              </Grid>

              <Grid item xs={6} sm={5}>
                <IconButton className="profile-button" onClick={onProfilePageClick}>
                  <FaUserAlt size={25} />
                  <Typography variant="h6" component="div" marginTop={1}>
                    PROFILE PAGE
                  </Typography>
                </IconButton>
              </Grid>

              <Grid item xs={6} sm={5}>
                <Button className="iq-history-button" onClick={onIQHistoryClick}>
                  <FaChartLine size={25} />
                  <Typography variant="h6" component="div" marginTop={1}>
                    IQ HISTORY
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {/* Additional content for the main page */}
    </div>
  );
}

export default MainPageView;
