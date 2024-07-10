import React from "react";
import {
  Grid, Box, MenuItem, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, InputLabel, Select, Snackbar, IconButton, Typography, Button, TextField
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import SelectComponent from "../components/SelectComponent";
import ExpandableCard from "../components/ExpandableCard";

import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import "./Styled.css";

const AddNewWorkout = ({
  pickExercise,
  unPickExercise,
  savedWorkouts,
  chosenExercises,
  lastSearch,
  loadingSearch,
  loadingUpdate,
  loadingDelete,
  loadingCreate,
  error,
  equipment,
  workoutName,
  workoutId,
  updateWorkoutName,
  exerciseTypes,
  muscleGroups,
  difficulties,
  optionsToShow,
  createOrEdit,
  handleChangeCreateOrEditACB,

  openDialog,
  dialogData,
  handleCloseDialogACB,
  handleActionDialogACB,

  openSnackBar,
  messageInfoSnackBar,
  messageTypeSnackBar,
  handleCloseSnackBarACB,
  handleExitedSnackBarACB,

  setIdACB,
  setSelectWorkoutWithIdACB,
  setNameACB,
  setTypeACB,
  setMuscleACB,
  setDifficultyACB,
  searchExercisesACB,

  removeExercisesACB,
  createNewWorkoutChecksACB,
}) => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  function add_workout_to_menuCB(workout, index) {
    return (
      <MenuItem value={workout["id"]} key={index}>
        {workout["name"]}
      </MenuItem>
    );
  }

  const newWorkoutNameACB = (e) => {
    updateWorkoutName(e.target.value);
  };

  const newNameACB = (e) => {
    setNameACB(e.target.value);
  };

  const newTypeACB = (e) => {
    setTypeACB(e.target.value);
  };

  const newMuscleACB = (e) => {
    setMuscleACB(e.target.value);
  };

  const newDifficultyACB = (e) => {
    setDifficultyACB(e.target.value);
  };

  function createNewWorkoutDeleteACB() {
    createNewWorkoutChecksACB("delete");
  }

  function resetWorkoutACB() {
    setSelectWorkoutWithIdACB(workoutId.toString());
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ marginTop: "2em" }}
    >
      <Grid item xs={10}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "inherit",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Search for Exercises
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                color="secondary"
                sx={{
                  fontFamily: "inherit",
                  padding: "0.5em 1.5em",
                  margin: "0.5em 0.5em 0.5em 0",
                  borderRadius: "0.8em",
                  color: "white",
                }}
                variant="contained"
                onClick={() => (window.location.href = "/workouts")}
              >
                Go Back To Saved Workouts
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={10}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          sx={{ marginTop: "2em" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{ marginBottom: "2em", padding: "0.5em 1.5em" }}
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} sx={{ marginBottom: "2em" }}>
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={searchExercisesACB}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-error-helper-text"
                        label="Name of exercise"
                        onChange={newNameACB}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SelectComponent
                        label="Exercise Type"
                        options={exerciseTypes}
                        onChange={newTypeACB}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SelectComponent
                        label="Muscle Group"
                        options={muscleGroups}
                        onChange={newMuscleACB}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SelectComponent
                        label="Difficulty"
                        options={difficulties}
                        onChange={newDifficultyACB}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <LoadingButton
                        loading={loadingSearch}
                        type="submit"
                        variant="contained"
                        endIcon={<FaSearch />}
                        loadingPosition="end"
                      >
                        Search For Exercises
                      </LoadingButton>
                    </Grid>
                    <Grid item xs={12} sx={{ color: "red" }}>
                      {error !== "" && error}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                {lastSearch.length > 0 ? (
                  <>
                    {optionsToShow.reduce((a, exercise) => {
                      if (
                        equipment.findIndex((e) => {
                          return e.name === exercise["equipment"];
                        }) >= 0
                      )
                        a.push(exercise.id);
                      return a;
                    }, []).length > 0 ? (
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "inherit",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Search Results
                        </Typography>
                      </Grid>
                    ) : null}
                  </>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "inherit",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    No Results Found
                  </Typography>
                )}
                {optionsToShow.length > 0 ? (
                  <>
                    {optionsToShow.reduce((a, exercise) => {
                      if (
                        equipment.findIndex((e) => {
                          return e.name === exercise["equipment"];
                        }) >= 0
                      )
                        a.push(exercise.id);
                      return a;
                    }, []).length > 0 ? (
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        {optionsToShow.map((exercise, index) => {
                          if (
                            equipment.findIndex((e) => {
                              return e.name === exercise["equipment"];
                            }) >= 0
                          ) {
                            return (
                              <Grid item xs={12} key={index}>
                                <ExpandableCard
                                  item={exercise}
                                  cardIcon={<FaPlus />}
                                  onPressAdd={pickExercise}
                                />
                              </Grid>
                            );
                          } else return null;
                        })}
                      </Grid>
                    ) : lastSearch.length === 0 ? null : (
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "inherit",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        No result for the given filter
                      </Typography>
                    )}
                  </>
                ) : lastSearch.length === 0 ? null : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "inherit",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    No new results
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} sx={{ padding: "0em" }}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid item xs={6} >
                <ToggleButtonGroup
                  color="primary"
                  value={createOrEdit}
                  exclusive
                  onChange={handleChangeCreateOrEditACB}
                  aria-label="Platform"
                >
                  <ToggleButton value="create">Create</ToggleButton>
                  <ToggleButton value="edit">Edit</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {createOrEdit === "edit" && (
                <Grid item xs={6}>
                  {savedWorkouts.length > 0 ? (
                    <FormControl fullWidth>
                      <InputLabel id="choose_workout">Choose</InputLabel>
                      <Select
                        labelId="choose_workout_label"
                        id="choose_workout"
                        value={workoutId === "-1" ? "" : workoutId}
                        label="Choose"
                        onChange={setIdACB}
                      >
                        {savedWorkouts.map(add_workout_to_menuCB)}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "inherit",
                        fontWeight: "regular",
                        color: "black",
                      }}
                    >
                      No workout yet, Create one !
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={chosenExercises.length > 0 ? 6 : 9}>
                    <TextField
                      label="Name of Workout"
                      value={workoutName}
                      onChange={newWorkoutNameACB}
                    />
                  </Grid>
                  {workoutId === "-1" ? (
                    <Grid item xs={3} sx={{ textAlign: "center" }}>
                      <LoadingButton
                        color="primary"
                        sx={{
                          fontFamily: "inherit",
                          borderRadius: "0.8em",
                          color: "white",
                        }}
                        variant="contained"
                        loading={loadingCreate}
                        onClick={createNewWorkoutChecksACB}
                      >
                        Create
                      </LoadingButton>
                    </Grid>
                  ) : (
                    <Grid item >
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={5}>
                          {Object.keys(chosenExercises).length > 0 && (
                            <LoadingButton
                              color="primary"
                              sx={{
                                fontFamily: "inherit",
                                borderRadius: "0.8em",
                                color: "white",
                              }}
                              variant="contained"
                              loading={loadingUpdate}
                              onClick={createNewWorkoutChecksACB}
                            >
                              Update
                            </LoadingButton>
                          )}
                        </Grid>
                        <Grid item xs={chosenExercises.length > 0 ? 5 : 12}>
                          <LoadingButton
                            color="error"
                            sx={{
                              fontFamily: "inherit",
                              borderRadius: "0.8em",
                              color: "white",
                            }}
                            variant="contained"
                            loading={loadingDelete}
                            onClick={createNewWorkoutDeleteACB}
                          >
                            Delete
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: "bold",
                    color: "black",
                    padding: "0.5em",
                  }}
                >
                  Chosen exercises
                </Typography>
              </Grid>
              <Grid item xs={12} >
                <Grid container justifyContent="flex-start" alignContent="center">
                  <Box sx={{ marginRight: "1em" }}>
                    {chosenExercises.length > 0 && (
                      <Button
                        color="error"
                        sx={{
                          fontFamily: "inherit",
                          borderRadius: "0.8em",
                          color: "white",
                        }}
                        variant="contained"
                        onClick={removeExercisesACB}
                      >
                        Clear list
                      </Button>
                    )}
                  </Box>
                  <Box>
                    {workoutId !== "-1" && (
                      <Button
                        color="primary"
                        sx={{
                          fontFamily: "inherit",
                          borderRadius: "0.8em",
                          color: "white",
                        }}
                        variant="contained"
                        onClick={resetWorkoutACB}
                      >
                        Reset
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  {chosenExercises.length > 0 ? (
                    chosenExercises.map((exercise, index) => {
                      return (
                        <Grid item xs={12} key={index}>
                          <ExpandableCard
                            item={exercise}
                            cardIcon={<FaTrash />}
                            onPressAdd={unPickExercise}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: "inherit", color: "black" }}
                      >
                        No Exercises Added
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        key={messageInfoSnackBar ? messageInfoSnackBar.key : undefined}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBarACB}
        TransitionProps={{ onExited: handleExitedSnackBarACB }}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackBarACB}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          onClose={handleCloseSnackBarACB}
          severity={messageTypeSnackBar}
          sx={{ width: "100%" }}
        >
          {messageInfoSnackBar ? messageInfoSnackBar.message : undefined}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialogACB}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogData.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogData.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionDialogACB}>
            {dialogData.button1}
          </Button>
          <Button onClick={handleCloseDialogACB} autoFocus>
            {dialogData.button2}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AddNewWorkout;
