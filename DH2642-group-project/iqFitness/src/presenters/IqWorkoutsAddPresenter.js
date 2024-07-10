import React, { useState, useEffect } from "react";
import IqWorkoutsAddView from "../views/IqWorkoutsAddView";
import { getExercises, pickExercise, unPickExercise, updateWorkoutName, updateWorkoutId } from '../actions/exercises.js';
import { useSelector, useDispatch } from 'react-redux';
import { historyDecoder, historyEncoder } from "../actions/historyConversion";
import { getDBData, updateDocInDB } from "../store/persistance/firebase";

const equipmentList = ["none", "all", "dumbbell", "barbell", "e-z_curl_bar", "body_only", "cable", "foam_roll", "machine", "kettlebells", "other"];

const exerciseTypes = {
    cardio: "Cardio",
    olympic_weightlifting: "Olympic Weightlifting",
    plyometrics: "Plyometrics",
    powerlifting: "Powerlifting",
    strength: "Strength",
    stretching: "Stretching",
    strongman: "Strongman",
}

const muscleGroups = {
    abdominals: "Abdominals",
    adductors: "Adductors",
    biceps: "Biceps",
    calves: "Calves",
    chest: "Chest",
    forearms: "Forearms",
    glutes: "Glutes",
    hamstrings: "Hamstrings",
    lats: "Lats",
    lower_back: "Lower Back",
    middle_back: "Middle Back",
    neck: "Neck",
    quadriceps: "Quadriceps",
    traps: "Traps",
    triceps: "Triceps",
}

const difficulties = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
}

const IqWorkouts = () => {
    const chosenExercises = useSelector((state) => state.exercises.currentPicked ? state.exercises.currentPicked : [])
    const lastSearch = useSelector((state) => state.exercises.lastSearch ? state.exercises.lastSearch : [])

    const user = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);
    const sendToFirebase = useSelector((state) => state.user.sendToFirebase)
    const firebaseError = useSelector((state) => state.user.firebaseError ? state.user.firebaseError : null)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [error, setError] = useState("")
    const [equipment,] = useState(equipmentList.map((e, index) => { return { id: index, name: e } }).slice(1));

    const [savedWorkouts, setSavedWorkouts] = useState([])
    const [history, setHistory] = useState(undefined)

    const workoutName = useSelector((state) => state.exercises.workoutName ? state.exercises.workoutName : "")
    const workoutId = useSelector((state) => state.exercises.workoutId ? state.exercises.workoutId : "-1")
    const [idNewWorkout, setIdNewWorkout] = useState("-1");

    const [optionsToShow, setOptionsToShow] = useState([])
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [muscle, setMuscle] = useState("")
    const [difficulty, setDifficulty] = useState("")

    const [createOrEdit, setCreateOrEdit] = useState('create');

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState({});   //{ type:"1" or "2", title:"title message", content:"content message", button1:"button1 text", button2:"button2 text"

    const [snackPack, setSnackPack] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageInfoSnackBar, setMessageInfoSnackBar] = useState(undefined);
    const [messageTypeSnackBar, setMessageTypeSnackBar] = useState(undefined);

    const [changeType, setChangeType] = useState("")

    const dispatch = useDispatch()

    const searchExercises = async (name, type, muscle, difficulty) => {
        setLoadingSearch(true)
        try {
            await dispatch(getExercises(name, type, muscle, difficulty))
        }
        catch (error) {
            setLoadingSearch(false)
            setError(error.message)
        }
    }
    const pickExerciseACB = (exercise) => {
        dispatch(pickExercise(exercise))
    }
    const unPickExerciseACB = (exercise) => {
        dispatch(unPickExercise(exercise))
    }

    const updateWorkoutNameACB = (name) => {
        dispatch(updateWorkoutName(name))
    }
    const updateWorkoutIdACB = (id) => {
        dispatch(updateWorkoutId(id))
    }

    useEffect(() => {
        setLoadingSearch(false)
    }, [lastSearch])

    useEffect(() => {
        setIdNewWorkout((savedWorkouts.reduce((a, e) => { return Math.max(a, parseInt(e.id)) }, 0) + 1).toString());
    }, [savedWorkouts]);

    useEffect(() => {
        if (user) {
            setSavedWorkouts(user.savedWorkouts);
            setHistory(historyDecoder(user.history));
        }
    }, [user, user.savedWorkouts, user.history]);

    useEffect(() => {
        if (workoutId !== "-1") {
            setCreateOrEdit("edit");
        }
    }, [workoutId]);


    useEffect(() => {
        if (snackPack.length > 0 && !messageInfoSnackBar) {
            // Set a new snack when we don't have an active one
            setMessageInfoSnackBar({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpenSnackBar(true);
        } else if (snackPack.length && messageInfoSnackBar && openSnackBar) {
            // Close an active snack when a new one is added
            setOpenSnackBar(false);
        }
    }, [snackPack, messageInfoSnackBar, openSnackBar]);


    useEffect(() => {
        const newOptions = lastSearch.filter((exercise) => {
            return !chosenExercises.some((chosen) => {
                return chosen.name === exercise.name
            })
        })
        setOptionsToShow(newOptions)
    }, [lastSearch, chosenExercises]);

    useEffect(() => {
        if (sendToFirebase) {
            if (changeType === "update") {
                setLoadingUpdate(true);
            }
            else if (changeType === "delete") {
                setLoadingDelete(true);
            }
            else if (changeType === "create") {
                setLoadingCreate(true);
            }
        } else if (firebaseError) {
            setMessageTypeSnackBar("error")
            createSnackPackMessage(firebaseError)();
            dispatch({ type: "RESET_ERROR" })
            if (changeType === "update") {
                setLoadingUpdate(false);
            }
            else if (changeType === "delete") {
                setLoadingDelete(false);
            }
            else if (changeType === "create") {
                setLoadingCreate(false);
            }
        } else {
            setMessageTypeSnackBar("success");
            if (changeType === "update") {
                setLoadingUpdate(false);
                createSnackPackMessage("Workout updated")();
            }
            else if (changeType === "delete") {
                setLoadingDelete(false);
                createSnackPackMessage("Workout deleted")();
            }
            else if (changeType === "create") {
                setLoadingCreate(false);
                createSnackPackMessage("Workout created")();
            }

        }

    }, [sendToFirebase, user.savedWorkouts])

    const addNewWorkoutDataBaseACB = async (newWorkout) => {
        let concatenatedWorkouts = [...savedWorkouts];
        let newHistory;
        let workoutHistory;
        let ind;
        const type = newWorkout["type"];

        if (newWorkout["type"] === "create") {
            setChangeType("create");
            setLoadingCreate(true);
            delete newWorkout["type"];
            concatenatedWorkouts.push(newWorkout);

            newHistory = {};
            newHistory[newWorkout.id] = newWorkout.exercises.reduce((d, e) => { d[e.name] = {}; return d; }, {});
            newHistory = Object.assign({}, history, newHistory);
        }
        else if (newWorkout["type"] === "delete") {
            setChangeType("delete");
            setLoadingDelete(true);
            ind = null;
            concatenatedWorkouts.forEach((e, index) => { if (e.id === newWorkout["id"]) ind = index; });
            delete newWorkout['type'];
            concatenatedWorkouts = concatenatedWorkouts.filter((e, index) => { return index !== ind });

            newHistory = JSON.parse(JSON.stringify(history));
            workoutHistory = newHistory[newWorkout['id']];

            const names_list = newWorkout["exercises"].reduce((a, f) => { a.push(f.name); return a; }, []);

            workoutHistory = Object.keys(workoutHistory).reduce((d, e) => { if (names_list.includes(e)) d[e] = workoutHistory[e]; return d; }, {});

            newWorkout["exercises"].reduce((a, e) => { a.push(e.name); return a; }, []).forEach((e) => {
                if (!Object.keys(workoutHistory).includes(e)) workoutHistory[e] = {};
            })

            delete newHistory[newWorkout["id"]];
        }
        else {   //update
            setChangeType("update");
            setLoadingUpdate(true);
            ind = null;
            concatenatedWorkouts.forEach((e, index) => { if (e.id === newWorkout["id"]) ind = index; });
            delete newWorkout['type'];
            concatenatedWorkouts[ind] = newWorkout;

            newHistory = JSON.parse(JSON.stringify(history));
            workoutHistory = newHistory[newWorkout['id']];

            const names_list = newWorkout["exercises"].reduce((a, f) => { a.push(f.name); return a; }, []);

            workoutHistory = Object.keys(workoutHistory).reduce((d, e) => { if (names_list.includes(e)) d[e] = workoutHistory[e]; return d; }, {});

            newWorkout["exercises"].reduce((a, e) => { a.push(e.name); return a; }, []).forEach((e) => {
                if (!Object.keys(workoutHistory).includes(e)) workoutHistory[e] = {};
            })

            newHistory[newWorkout["id"]] = workoutHistory;
        }

        const newUserData = { ...user, savedWorkouts: concatenatedWorkouts, history: newHistory }
        dispatch({ type: "SET_USER_INFO", payload: newUserData })
    }



    const handleChangeCreateOrEdit = (event, newValue) => {
        if (newValue !== createOrEdit && newValue !== null) {
            chosenExercises.forEach((e) => { unPickExerciseACB(e) });
            setCreateOrEdit(newValue);
            if (newValue === "create") {
                updateWorkoutIdACB("-1");
                updateWorkoutNameACB("");
            }
            else {
                if (Object.keys(savedWorkouts).length > 0) {
                    let first_wk = savedWorkouts[Object.keys(savedWorkouts)[0]];
                    updateWorkoutIdACB(first_wk.id);
                    updateWorkoutNameACB(first_wk.name);
                    first_wk.exercises.forEach((e) => { pickExerciseACB(e) });
                }
            }
        }
    };


    const createSnackPackMessage = (message) => () => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleCloseSnackBarACB = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const setSelectWorkoutWithIdACB = (select_id) => {
        updateWorkoutIdACB(select_id);

        let workout_to_update = Object.values(savedWorkouts).find((e) => { return (e.id).toString() === select_id });
        updateWorkoutNameACB(workout_to_update["name"]);
        chosenExercises.forEach((e) => { unPickExerciseACB(e) });
        workout_to_update.exercises.forEach((e) => { pickExerciseACB(e) });
    }

    const setIdACB = (event) => {
        setSelectWorkoutWithIdACB(event.target.value);
    }

    const searchExercisesACB = async (e) => {
        e.preventDefault()
        await searchExercises(name, type, muscle, difficulty)
    }

    function createNewWorkoutACB(type = null) {

        let ExpandedExercises = JSON.parse(JSON.stringify(chosenExercises)) //create an independent copy
        for (let i = 0; i < ExpandedExercises.length; i++) {
            ExpandedExercises[i]["sets"] = 4;
            ExpandedExercises[i]["reps"] = 8;
        }

        let newWorkout = {
            id: idNewWorkout,
            name: workoutName,
            exercises: ExpandedExercises,
            type: "create",
        };

        if (workoutId !== "-1") {
            newWorkout["id"] = workoutId;
            if (Object.values(chosenExercises).length > 0)
                newWorkout["type"] = "update";
            else
                newWorkout["type"] = "delete";
        }

        if (type !== null) newWorkout['type'] = "delete";

        addNewWorkoutDataBaseACB(newWorkout);
    }

    function handleCloseDialogACB() {
        setOpenDialog(false);
    }

    function handleActionDialogACB() {
        if (dialogData.type === "1") {
            setOpenDialog(false);
            createNewWorkoutACB();
        }
        else if (dialogData.type === "2") {
            setOpenDialog(false);
            createNewWorkoutACB("delete");
        }
    }


    function removeExercisesACB() {
        chosenExercises.forEach((e) => { unPickExerciseACB(e) });
    }


    function createNewWorkoutChecksACB(type = null) {
        if (workoutId !== "-1") {
            let old_exercises = Object.values(savedWorkouts).find((e) => { return (e.id).toString() === workoutId })["exercises"].reduce((a, e) => { a.push(e.name); return a; }, []);
            let new_exercises = chosenExercises.reduce((a, e) => { a.push(e.name); return a; }, []);
            old_exercises.sort(function (a, b) { return a > b });
            new_exercises.sort(function (a, b) { return a > b });

            if (type !== null && type === "delete") {
                setOpenDialog(true);
                setDialogData({
                    type: "2",
                    title: "Delete Workout?",
                    content: "It will delete all the history linked to the exercises you deleted",
                    button1: "Delete",
                    button2: "Cancel",
                });
                return;
            }

            if (JSON.stringify(old_exercises) !== JSON.stringify(new_exercises)) {
                if (new_exercises.length === 0) {
                    setDialogData({
                        type: "2",
                        title: "Delete Workout?",
                        content: "Deleting the workout will delete all related history",
                        button1: "Delete",
                        button2: "Cancel",
                    });
                }
                else {
                    setDialogData({
                        type: "1",
                        title: "Update Workout ?",
                        content: "It will delete all the history linked to the exercises you deleted",
                        button1: "Update",
                        button2: "Cancel",
                    });
                }
                setOpenDialog(true);
            }
            else {
                if (savedWorkouts.find((e) => { return (e.id).toString() === workoutId }).name !== workoutName) {
                    createNewWorkoutACB();
                }
                else {
                    setMessageTypeSnackBar("warning");
                    createSnackPackMessage("You didn't change anything")();
                }
            }
        }
        else {
            if (chosenExercises.length > 0) {
                if (workoutName !== "" && workoutName.replace(/\s/g, '').length > 0) {
                    if (savedWorkouts.findIndex((w) => { return w.name === workoutName }) === -1) {
                        createNewWorkoutACB();
                    }
                    else {
                        setMessageTypeSnackBar("warning");
                        createSnackPackMessage("There is already a workout with this name")();
                    }
                }
                else {
                    setMessageTypeSnackBar("error");
                    createSnackPackMessage("Choose the workout name")();
                }
            }
            else {
                setMessageTypeSnackBar("error");
                createSnackPackMessage("Add exercises to the workout")();
            }
        }
    }

    return (
        <IqWorkoutsAddView
            pickExercise={pickExerciseACB}
            unPickExercise={unPickExerciseACB}
            savedWorkouts={savedWorkouts}
            chosenExercises={chosenExercises}
            lastSearch={lastSearch}
            loadingSearch={loadingSearch}
            loadingUpdate={loadingUpdate}
            loadingDelete={loadingDelete}
            loadingCreate={loadingCreate}
            error={error}
            equipment={equipment}
            workoutName={workoutName}
            workoutId={workoutId}
            updateWorkoutName={updateWorkoutNameACB}
            exerciseTypes={exerciseTypes}
            muscleGroups={muscleGroups}
            difficulties={difficulties}
            optionsToShow={optionsToShow}
            createOrEdit={createOrEdit}
            handleChangeCreateOrEditACB={handleChangeCreateOrEdit}

            openDialog={openDialog}
            dialogData={dialogData}   //{ type:"1" or "2", title:"title message", content:"content message", button1:"button1 text", button2:"button2 text"
            handleCloseDialogACB={handleCloseDialogACB}
            handleActionDialogACB={handleActionDialogACB}

            openSnackBar={openSnackBar}
            messageInfoSnackBar={messageInfoSnackBar}
            messageTypeSnackBar={messageTypeSnackBar}
            handleCloseSnackBarACB={handleCloseSnackBarACB}
            handleExitedSnackBarACB={() => setMessageInfoSnackBar(undefined)}

            setIdACB={setIdACB}
            setSelectWorkoutWithIdACB={setSelectWorkoutWithIdACB}
            setNameACB={setName}
            setTypeACB={setType}
            setMuscleACB={setMuscle}
            setDifficultyACB={setDifficulty}
            searchExercisesACB={searchExercisesACB}

            removeExercisesACB={removeExercisesACB}
            createNewWorkoutChecksACB={createNewWorkoutChecksACB}
        />
    );
}

export default IqWorkouts;