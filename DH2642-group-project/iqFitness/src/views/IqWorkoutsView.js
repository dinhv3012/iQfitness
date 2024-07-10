import React from 'react';
import { Grid, Box, FormControl, InputLabel, Snackbar, IconButton, MenuItem, Select, Typography, Button, TextField, Container } from '@mui/material';
import AccordionList from '../components/AccordionList';
import ReadMore from "../components/ReadMore";
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from "@mui/lab/LoadingButton";

import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

const IqWorkoutsView = ({
    savedWorkouts,
    loadingUpdate,
    workoutToEdit,
    changeReps,
    changeSets,
    changeRepsNSets,
    setWorkoutToEdit,
    openSnackBar,
    messageInfoSnackBar,
    messageTypeSnackBar,
    handleCloseSnackBar,
    handleExitedSnackBar,
}) => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    return <Container component="main">
        <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ marginTop: "1em" }}
        >
            <Grid item xs={10}>

                <Grid container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Grid item >
                        <Typography variant="h5" sx={{ fontFamily: "inherit", fontWeight: "bold", color: "black", marginLeft: "1em" }}>Saved Workouts</Typography>
                    </Grid>
                    <Grid item >
                        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                            <Button color='secondary' sx={{ fontFamily: "inherit", margin: "0.5em 0 0.5em 0", borderRadius: "0.8em", color: "white" }} variant="contained" onClick={() => window.location.href = "workouts/add"} >
                                Add/Edit Workouts
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    {!savedWorkouts ?
                        <Grid container justifyContent="center">
                            <CircularProgress />
                        </Grid>
                        :
                        <Box></Box>
                    }
                </Grid>
                {savedWorkouts && savedWorkouts.length > 0
                    && <AccordionList listData={savedWorkouts.reduce((a, e) => {
                        a.push({
                            name: e.name, exercises: e.exercises.reduce((b, f) => {
                                b.push({
                                    name:
                                        <div>
                                            <div>
                                                <Typography variant="h6" sx={{ fontFamily: "inherit", color: "black", marginTop: "0.5em" }}>{f.name}</Typography>
                                            </div>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Difficulty: " + f.difficulty}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Equipment: " + f.equipment}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Muscle: " + f.muscle}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Type: " + f.type}</li></Typography>
                                            <Typography component={'span'} variant="body1" sx={{ fontFamily: "inherit", display: "inline-block", color: "black", marginLeft: "2em" }}><li><span style={{ textDecoration: "underline", display: "inline" }}>{"Instructions:"}</span><ReadMore style={{ margin: "0", display: "inline" }} length="100">{" " + f.instructions}</ReadMore></li></Typography>
                                            <div>
                                            </div>
                                        </div>
                                }); return b;
                            }, [])
                        }); return a;
                    }, [])} />
                }
            </Grid>
            {savedWorkouts && savedWorkouts.length > 0
                ?
                <Grid item xs={11} sm={8} md={7} lg={6} sx={{ padding: "0.5em" }}>
                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                                <Typography variant="h5" sx={{ fontFamily: "inherit", fontWeight: "bold", color: "black", margin: "0.5em 0 0.5em 1em" }}>Edit default values of workout</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ padding: "0.5em 1em" }}>
                            <FormControl fullWidth>
                                <InputLabel id="chooseWorkout">Select the Workout</InputLabel>
                                <Select
                                    labelId="chooseWorkoutLabel"
                                    id="chooseWorkout"
                                    label="Select the Workout"
                                    onChange={setWorkoutToEdit}
                                    value={workoutToEdit.id || ""}

                                >
                                    {savedWorkouts.map((workout, index) => {
                                        return <MenuItem key={index} value={workout.id}>
                                            {workout["name"]}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>

                        </Grid>

                        {workoutToEdit.exercises
                            &&
                            <Grid item xs={12} sm={10} md={8} sx={{ padding: "0.5em" }}>

                                {workoutToEdit.exercises.map((exercise, index) => {
                                    return <Grid container
                                        key={index}
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center">
                                        <Grid item xs={4} sm={6} sx={{ padding: "0.5em" }}>
                                            {exercise.name}
                                        </Grid>
                                        <Grid item xs={4} sm={3}>
                                            <TextField
                                                label="Reps"
                                                type="number"
                                                value={exercise.reps || ""}
                                                onChange={(event) => { changeReps(event.target.value, index) }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 20,
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} sm={3} sx={{ padding: "0.5em" }} >
                                            <TextField
                                                label="Sets"
                                                type="number"
                                                value={exercise.sets || ""}
                                                onChange={(event) => { changeSets(event.target.value, index) }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 6,
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                })}
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <LoadingButton
                                        color="primary"
                                        sx={{
                                            fontFamily: "inherit",
                                            borderRadius: "0.8em",
                                            color: "white",
                                            padding: "0.4em 2em"
                                        }}
                                        variant="contained"
                                        loading={loadingUpdate}
                                        onClick={changeRepsNSets}
                                    >
                                        Save
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        }

                    </Grid>
                </Grid>
                :
                <Grid item xs={12}>
                    {savedWorkouts !== null ? <Box sx={{ textAlign: "center" }}>You do not have any workouts saved, add one now!</Box> : <Box></Box>}
                </Grid>
            }
        </Grid>
        <Snackbar
            key={messageInfoSnackBar ? messageInfoSnackBar.key : undefined}
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
            TransitionProps={{ onExited: handleExitedSnackBar }}
            action={
                <React.Fragment>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={handleCloseSnackBar}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        >
            <Alert
                onClose={handleCloseSnackBar}
                severity={messageTypeSnackBar}
                sx={{ width: "100%" }}
            >
                {messageInfoSnackBar ? messageInfoSnackBar.message : undefined}
            </Alert>
        </Snackbar>
    </Container>
}

export default IqWorkoutsView;