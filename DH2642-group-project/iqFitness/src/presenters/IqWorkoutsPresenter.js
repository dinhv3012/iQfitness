import React, { useState, useEffect } from "react";
import IqWorkoutsView from "../views/IqWorkoutsView";
import { useDispatch, useSelector } from 'react-redux';
import { firebaseLoader } from "../store/persistance/firebase"

const IqWorkouts = () => {
    const user = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);
    const sendToFirebase = useSelector((state) => state.user.sendToFirebase)
    const firebaseError = useSelector((state) => state.user.firebaseError ? state.user.firebaseError : null)

    const [savedWorkouts, setSavedWorkouts] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [workoutToEdit, setWorkoutToEdit] = useState({});
    const [workoutId, setWorkoutId] = useState(null);
    const [reps, setReps] = useState([]);
    const [sets, setSets] = useState([]);

    const [snackPack, setSnackPack] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageInfoSnackBar, setMessageInfoSnackBar] = useState(undefined);
    const [messageTypeSnackBar, setMessageTypeSnackBar] = useState(undefined);

    const dispatch = useDispatch();



    useEffect(() => {
        if (user) {
            setSavedWorkouts(user.savedWorkouts);
            if (user.savedWorkouts.length > 0 && workoutToEdit?.id === undefined) {
                setWorkoutToEdit(user.savedWorkouts[0]);
                setWorkoutId(user.savedWorkouts[0].id);
            }
        }
    }, [user, user.savedWorkouts])


    useEffect(() => {
        if (savedWorkouts) {
            const selectedWorkout = savedWorkouts.find((workout) => workout.id === workoutToEdit.id)
            setWorkoutToEdit(selectedWorkout);
        }
    }, [savedWorkouts, workoutToEdit?.id]);


    useEffect(() => {
        if (workoutToEdit && workoutToEdit?.name) {
            setReps(workoutToEdit.exercises.reduce((a, e) => { a.push(e.reps); return a; }, []))
            setSets(workoutToEdit.exercises.reduce((a, e) => { a.push(e.sets); return a; }, []))
        }

    }, [workoutToEdit]);

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
        if (sendToFirebase) {
            setLoadingUpdate(true)
        }
        else if (firebaseError) {
            setMessageTypeSnackBar("error")
            createSnackPackMessage(firebaseError)();
            dispatch({ type: "RESET_ERROR" })
            setLoadingUpdate(false)
        } else {
            setLoadingUpdate(false)
            setMessageTypeSnackBar("success");
            createSnackPackMessage("Default values updated")();
        }
    }, [sendToFirebase, user.savedWorkouts])

    const setSavedWorkoutsACB = async (newSavedWorkout) => {
        const newUser = { ...user, savedWorkouts: newSavedWorkout };
        dispatch({ type: "SET_USER_INFO", payload: newUser });
    }

    function changeRepsNSetsACB() {
        if (JSON.stringify(savedWorkouts.find((e) => { return e.id === workoutId }).exercises) !== JSON.stringify(workoutToEdit.exercises)) {
            setSavedWorkoutsACB(savedWorkouts.map((workout) => workout.id === workoutToEdit.id ? { ...workout, exercises: workoutToEdit.exercises } : workout));
            setLoadingUpdate(true);
        }
        else {
            setMessageTypeSnackBar("success");
            createSnackPackMessage("Default values already saved")();
        }

    }

    const setWorkoutToEditACB = (event) => {
        const selectedWorkout = savedWorkouts.find((workout) => workout.id === event.target.value.toString());
        setWorkoutToEdit(selectedWorkout);
        setWorkoutId(event.target.value.toString());
    };


    function changeRepsACB(value, index) {
        const newWorkout = JSON.parse(JSON.stringify(workoutToEdit))
        newWorkout.exercises[index].reps = Number(value);
        setWorkoutToEdit(newWorkout);
    }

    function changeSetsACB(value, index) {
        const newWorkout = JSON.parse(JSON.stringify(workoutToEdit))
        newWorkout.exercises[index].sets = Number(value);
        setWorkoutToEdit(newWorkout);
    }

    const createSnackPackMessage = (message) => () => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleCloseSnackBarACB = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    return (
        <IqWorkoutsView
            savedWorkouts={savedWorkouts}
            loadingUpdate={loadingUpdate}
            workoutToEdit={workoutToEdit}
            reps={reps}
            changeReps={changeRepsACB}
            sets={sets}
            changeSets={changeSetsACB}
            changeRepsNSets={changeRepsNSetsACB}
            setWorkoutToEdit={setWorkoutToEditACB}

            openSnackBar={openSnackBar}
            messageInfoSnackBar={messageInfoSnackBar}
            messageTypeSnackBar={messageTypeSnackBar}
            handleCloseSnackBar={handleCloseSnackBarACB}
            handleExitedSnackBar={() => setMessageInfoSnackBar(undefined)}
        />
    );
}

export default IqWorkouts;