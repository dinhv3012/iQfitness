import React from 'react';
import { Grid, Input, Box, CircularProgress, Snackbar, IconButton, FormControl, InputLabel, MenuItem, Select, Typography, Button } from '@mui/material';
import AccordionList from '../components/AccordionList';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ReadMore from "../components/ReadMore";
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';


const AddNewInputView = ({
    savedWorkouts,
    history,
    loadingAdd,
    loadingDelete,
    id_workout,
    date,
    newWorkout,
    openSnackBar,
    messageInfo,
    messageType,
    setMessageInfo,
    messageDuration,
    setNewWorkoutFromEvent,
    changeWorkout,
    addSet,
    removeSet,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    handleClose,
    setDate,
    inputError,

}) => {
    const Alert = React.forwardRef(function Alert(alertProps, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...alertProps} />;
    });

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    function changeNewWorkoutACB(event, workout_i, set_index, isReps) {
        let newDict = JSON.parse(JSON.stringify(newWorkout))
        newDict[workout_i["name"]][set_index][isReps] = event.target.value;
        setNewWorkoutFromEvent(newDict);
    }

    function add_workout_to_menuCB(workout, index) {
        return <MenuItem value={workout["id"]} key={index}>
            {workout["name"]}
        </MenuItem>
    }

    return <Box>
        <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ marginTop: "1em" }}
        >
            <Grid item xs={12} sx={{margin:"0 2em"}}>

                <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                        <Typography variant="h5" sx={{ fontFamily: "inherit", fontWeight: "bold", color: "black", margin: "0.5em 0 0.5em 1em" }}>Add your new workout perfomances here !</Typography>
                    </Grid>
                </Grid>
            </Grid>
            {(!savedWorkouts) ?
            <Grid item>
                <CircularProgress />
            </Grid>
            :
            <>
            <Grid item xs={11}>
                <AccordionList listData={savedWorkouts.reduce((a, e) => {
                    a.push({
                        name: e.name, exercises: e.exercises.reduce((b, f) => {
                            b.push({
                                name:
                                    <Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontFamily: "inherit", color: "black", marginTop: "0.5em" }}>{f.name}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Difficulty: " + f.difficulty}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Equipment: " + f.equipment}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Muscle: " + f.muscle}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li>{"Type: " + f.type}</li></Typography>
                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", marginLeft: "2em" }}><li><ReadMore length="100">{"Instructions: " + f.instructions}</ReadMore></li></Typography>
                                        </Box>
                                    </Box>
                            }); return b;
                        }, [])
                    }); return a;
                }, [])} />
            </Grid>
            
            <Grid item xs={12}>
                {savedWorkouts.length > 0 ?
                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="h5" sx={{ fontFamily: "inherit", fontWeight: "bold", color: "black", margin: "0.5em 0 0.5em 0" }}>New log</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", margin: "0.5em 0 0.5em 0" }}>
                                Pick a workout and then date to make a workout log!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ padding: "0.5em", textAlign: "center" }}>
                            <FormControl sx={{ minWidth: "15em" }}>
                                <InputLabel id="choose_workout">Select the Workout</InputLabel>
                                <Select
                                    labelId="choose_workout_label"
                                    id="choose_workout"
                                    value={id_workout}
                                    label="Select the Workout"
                                    onChange={changeWorkout}
                                >
                                    {savedWorkouts.map(add_workout_to_menuCB)}
                                </Select>
                            </FormControl>
                        </Grid>

                        {id_workout !== ""
                            &&
                            <>
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{ textAlign: "center", marginLeft: "0em", padding: "0.5em" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="date"
                                            format="DD/MM/YYYY"
                                            value={date}
                                            onChange={setDate}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </>

                        }
                        {id_workout !== ""
                            &&
                            <>
                                <Grid item xs={12} marginTop={2}>
                                    <Typography variant="h6" sx={{ fontFamily: "inherit", fontWeight: "bold", color: "black", textAlign: "center" }}>
                                        Select number of reps for each set
                                    </Typography>
                                </Grid>
                                <Grid item xs={10} md={8}>
                                    <Grid container>
                                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                                            {Object.values(history[id_workout]).filter((ex) => { return Object.keys(ex).indexOf(date.format("DD-MM-YYYY")) !== -1 }).length === 0
                                            ?
                                            <LoadingButton
                                                color="primary"
                                                sx={{
                                                    fontFamily: "inherit", padding: "0.5em 1em", borderRadius: "0.8em", margin: "0.5em 1em", color: "white"
                                                }}
                                                variant="contained"
                                                loading={loadingAdd}
                                                onClick={addWorkout}
                                                disabled={inputError.length > 0}
                                            >
                                                <Typography variant="h6" sx={{ fontFamily: "inherit", color: "white", textAlign: "center", padding: "0 1em" }}>
                                                    Add Log
                                                </Typography>
                                            </LoadingButton>
                                            :
                                            <>
                                                <LoadingButton
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: "inherit", padding: "0.5em 1em", borderRadius: "0.8em", margin: "0.5em 1em", color: "white"
                                                    }}
                                                    variant="contained"
                                                    loading={loadingAdd}
                                                    onClick={updateWorkout}
                                                    disabled={inputError.length > 0}
                                                >
                                                    <Typography variant="h6" sx={{ fontFamily: "inherit", color: "white", textAlign: "center", padding: "0 1em" }}>
                                                        Save Log
                                                    </Typography>
                                                </LoadingButton>
                                                <LoadingButton
                                                    color="primary"
                                                    sx={{
                                                        fontFamily: "inherit", padding: "0.5em 1em", borderRadius: "0.8em", margin: "0.5em 1em", color: "white"
                                                    }}
                                                    variant="contained"
                                                    loading={loadingDelete}
                                                    onClick={deleteWorkout}
                                                    disabled={inputError.length > 0}
                                                >
                                                    <Typography variant="h6" sx={{ fontFamily: "inherit", color: "white", textAlign: "center", padding: "0 1em" }}>
                                                        Delete Log
                                                    </Typography>
                                                </LoadingButton>
                                                
                                            </>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {newWorkout 
                                ?
                                <Grid item xs={12} md={10}>
                                    {(history && history[id_workout]) &&
                                        savedWorkouts.find((e) => e.id === id_workout)?.exercises.map((workout_i, ex_ind) => {
                                            return <Grid
                                                container
                                                key={ex_ind}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                // spacing={3}
                                                marginTop={5}>
                                                <Grid item xs={4} sm={5} md={5} lg={4}>
                                                    <Typography variant="h6" sx={{ fontFamily: "inherit", color: "black", textAlign: "center" }}>
                                                        {workout_i["name"]}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={7} sm={5} md={3} lg={3}>
                                                    {newWorkout[workout_i["name"]].map((weight_rep, set_index) => {
                                                        if (!weight_rep.includes(undefined)) {
                                                            return <Grid container
                                                                key={set_index}
                                                                direction="row"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                paddingTop={2}>
                                                                <Grid item xs={4} sm={3}>
                                                                    <Typography variant="h6" sx={{ fontFamily: "inherit", color: "black", textAlign: "right" }}>
                                                                        {"Set " + (set_index + 1)}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={8} sm={9} sx={{ textAlign: "left" }}>
                                                                    <Grid container
                                                                        direction="row"
                                                                        justifyContent="center"
                                                                        alignItems="center">
                                                                        <Grid item xs={6}  >
                                                                            <Input fullWidth
                                                                                value={weight_rep ? weight_rep[1] : 1}
                                                                                onChange={(event) => changeNewWorkoutACB(event, workout_i, set_index, 1)}
                                                                                inputProps={{
                                                                                    step: 1,
                                                                                    min: 1,
                                                                                    type: 'number',
                                                                                    style: { textAlign: "right" }
                                                                                }}
                                                                            />
                                                                        </Grid>

                                                                        <Grid item xs={2} sx={{ marginLeft: "0.5em" }}>
                                                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", textAlign: "left" }}>
                                                                                reps
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid container
                                                                        direction="row"
                                                                        justifyContent="center"
                                                                        alignItems="center">
                                                                        <Grid item xs={6} sx={{ marginBottom: "0.2em" }}>
                                                                            <Input
                                                                                size="small"
                                                                                value={weight_rep ? weight_rep[0] : 1}
                                                                                onChange={(event) => changeNewWorkoutACB(event, workout_i, set_index, 0)}
                                                                                inputProps={{
                                                                                    step: 0.5,
                                                                                    min: 1,
                                                                                    type: 'number',
                                                                                    style: { textAlign: "right" }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={2} sx={{ marginLeft: "0.5em" }}>
                                                                            <Typography variant="body1" sx={{ fontFamily: "inherit", color: "black", textAlign: "left" }}>
                                                                                kg
                                                                            </Typography>
                                                                        </Grid>

                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        else return <></>
                                                    })}
                                                </Grid>
                                                
                                                <Grid item xs={12}>
                                                    <Grid container
                                                        direction="row"
                                                        justifyContent="center">
                                                        <Grid item sx={{ paddingRight: "0.5em", textAlign: "right" }}>
                                                            <Button name={workout_i['name']} color='secondary' sx={{ fontFamily: "inherit", padding: "0.25em 0.5em", borderRadius: "0.8em", color: "white" }} variant="contained" onClick={addSet}>
                                                                Add Set
                                                            </Button>
                                                        </Grid>
                                                        <Grid item sx={{ paddingRight: "0.5em", textAlign: "right" }}>
                                                            <Button name={workout_i['name']} color='secondary' sx={{ fontFamily: "inherit", padding: "0.25em 0.5em", borderRadius: "0.8em", color: "white" }} variant="contained" onClick={removeSet}>
                                                                Remove Set
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        })
                                    }
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    <CircularProgress />
                                </Grid>
                                }
                            </>

                        }
                    </Grid>
                    :
                    <Grid container direction="row" justifyContent="center">
                        <Typography variant="h6" sx={{ fontFamily: "inherit", color: "black", textAlign: "center", padding: "0 1em" }}>
                            No saved workouts!
                        </Typography>
                    </Grid>
                }
            </Grid>
            </>
            }
        </Grid>

        <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            open={openSnackBar}
            autoHideDuration={messageDuration}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            action={
                <React.Fragment>
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </React.Fragment>
            }
        >
            <Alert onClose={handleClose} severity={messageType} sx={{ width: '100%' }}>
                {messageInfo ? messageInfo.message : undefined}
            </Alert>
        </Snackbar>
    </Box>
}

export default AddNewInputView;