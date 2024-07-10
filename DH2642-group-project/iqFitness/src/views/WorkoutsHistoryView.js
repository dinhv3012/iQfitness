import React from "react";
import "./Styled.css";

import { Grid, Container, Box, FormControl, InputLabel, Select, Paper, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DetailWorkoutAccordion from '../components/DetailWorkoutAccordion';
import WorkoutsHistoryDetailsView from "./WorkoutsHistoryDetailsView"
import CircularProgress from '@mui/material/CircularProgress';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
}));



const WorkoutsHistoryView = ({
    savedWorkouts,
    workoutHistory,
    loading,
    workoutId,
    setIdACB,
    exercise,
    numSet,
    handleChange,
    handleChangeNumSet,
    openDialog,
    dialogData,
    handleCloseDialogACB,
    handleActionDialogACB,
    handleClickDateAxisACB,
    selectedDate,
    openMessageSnackBar,
    messageInfoSnackBar,
    messageTypeSnackBar,
    handleCloseSnackBar,
    handleExitedSnackBarACB,
}) => {

    function add_workout_to_menuCB(workout, index) {
        if (workout["name"]) {
            return <MenuItem value={workout["id"]} key={index}>
                {workout["name"]}
            </MenuItem>
        }
    }

    function find_idCB(e) {
        return Number(e["id"]) === Number(workoutId);
    }

    return (<Container component="main">
        <Grid container justifyContent="center" sx={{ marginTop: "1em" }}>
            <Typography variant="h4" component="div">IQHistory</Typography>

        </Grid>
        {loading === false ?
            savedWorkouts.length > 0 ?
                <Grid container
                    marginTop={2}
                    sx={{ padding: "0 2em" }}
                    spacing={2}>
                    <Grid item xs={12} sm={12} md={4} lg={3} >
                        <Item>
                            <FormControl fullWidth>
                                <InputLabel id="choose_workout">Workout</InputLabel>
                                <Select
                                    labelId="choose_workout_label"
                                    id="choose_workout"
                                    value={workoutId}
                                    label="Workout"
                                    onChange={setIdACB}

                                >
                                    {savedWorkouts.map(add_workout_to_menuCB)}
                                </Select>
                            </FormControl>
                            {workoutId !== ""
                                ?
                                <Box sx={{ padding: "1em 0.5em" }}>
                                    <DetailWorkoutAccordion listData={savedWorkouts.find(find_idCB)} />
                                </Box>
                                :
                                <Box></Box>}
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={8} lg={9}>
                        <Item>{workoutId !== ""
                            ? <Grid container
                                sx={{ padding: "0 0em" }}
                                spacing={2}>
                                <Grid item xs={12} >
                                    <Box sx={{ padding: "0.2em 0 0 2em", fontSize: "1.5em" }}>{(savedWorkouts && savedWorkouts.find) ? savedWorkouts.find(find_idCB).name : null}</Box>
                                </Grid>
                                <Grid item xs={12}>
                                    {workoutHistory[Object.keys(workoutHistory)[0]] === undefined ? <Box sx={{ padding: "2em 0", fontSize: "1em" }}>No data</Box>
                                        : <WorkoutsHistoryDetailsView
                                            workoutHistory={workoutHistory}
                                            exercise={exercise}
                                            numSet={numSet}
                                            handleChange={handleChange}
                                            handleChangeNumSet={handleChangeNumSet}

                                            openDialog={openDialog}
                                            dialogData={dialogData}
                                            handleCloseDialogACB={handleCloseDialogACB}
                                            handleActionDialogACB={handleActionDialogACB}
                                            handleClickDateAxisACB={handleClickDateAxisACB}

                                            selectedDate={selectedDate}

                                            openMessageSnackBar={openMessageSnackBar}
                                            messageInfoSnackBar={messageInfoSnackBar}
                                            messageTypeSnackBar={messageTypeSnackBar}
                                            handleCloseSnackBar={handleCloseSnackBar}
                                            handleExitedSnackBarACB={handleExitedSnackBarACB}
                                        />
                                    }
                                </Grid>
                            </Grid>
                            : <div>Select a workout</div>}</Item>
                    </Grid>

                </Grid> :
                <Grid container justifyContent="center">
                    <Typography variant="h6" component="div" sx={{ padding: "2em 0" }}>No saved workouts</Typography>
                </Grid>
            :
            <Grid container justifyContent="center" marginTop={4}>
                <CircularProgress />
            </Grid>
        }
    </Container>

    );
}

export default WorkoutsHistoryView;