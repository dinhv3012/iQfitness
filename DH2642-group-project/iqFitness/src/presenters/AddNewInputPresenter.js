import React, { useState, useEffect } from "react";
import AddNewInputView from "../views/AddNewInputView";
import { useDispatch, useSelector } from 'react-redux';
import { historyDecoder, historyEncoder } from "../actions/historyConversion";
import { getDBData, updateDocInDB } from "../store/persistance/firebase";
//import { useParams } from "react-router";
import dayjs from 'dayjs';


const AddNewInput = () => {
    const user = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);
    const sendToFirebase = useSelector((state) => state.user.sendToFirebase)
    const firebaseError = useSelector((state) => state.user.firebaseError ? state.user.firebaseError : null)

    const [changeType, setChangeType] = useState("");

    const [savedWorkouts, setSavedWorkouts] = useState(null)
    const [history, setHistory] = useState(null)
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [inputError, setInputError] = useState([]);

    const [idWorkout, setIdWorkout] = useState("");
    const [sliderType, setSliderType] = useState(true);
    const [date, setDate] = useState(dayjs());
    const [newWorkout, setNewWorkout] = useState({});
    const [snackPack, setSnackPack] = useState([]);
    const [openSnackBar, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);
    const [messageType, setMessageType] = useState(undefined);
    const [messageDuration, setMessageDuration] = useState(6000)
    const dispatch = useDispatch()

    const [newHistory, setNewHistory] = useState(null);


    useEffect(() => {
        if (user) {
            setSavedWorkouts(user.savedWorkouts);
            setHistory(historyDecoder(user.history));
        }
    }, [user, user.savedWorkouts, user.history]);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && openSnackBar) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, openSnackBar]);

    useEffect(() => {
        if (savedWorkouts && savedWorkouts.length > 0 && history !== null && idWorkout !== "") {
            //If there is already a logged workout this date, we load it
            if (Object.values(history[idWorkout]).filter((ex) => { return Object.keys(ex).indexOf(date.format("DD-MM-YYYY")) !== -1 }).length > 0) {
                let tempDict = {};
                Object.entries(history[idWorkout]).forEach(
                    ([key, value]) => {
                        tempDict[key] = value[date.format("DD-MM-YYYY")];
                    }
                )
                //undefined if there are no sets on this day : replaced by []
                savedWorkouts.filter((e) => { return e["id"] === idWorkout })[0]["exercises"].forEach((exercise, ind) => {
                    if (tempDict[exercise["name"]] === undefined)
                        tempDict[exercise["name"]] = [];
                });

                setMessageType("warning");
                setMessageDuration(6000);
                handleClick("An input already exist this day, modifying it will modify the already existing input");
                setNewWorkout(tempDict);
            }
            //If the history is not empty, we initialize the new log to the previous values
            else if (history[idWorkout] && Object.values(history[idWorkout]).length > 0) {
                let tempDict = {};
                savedWorkouts.filter((e) => { return e["id"] === idWorkout })[0]["exercises"].forEach((exercise, ind) => {
                    let arrayExerciseLastSessionhistory = history[idWorkout][exercise.name][Object.keys(history[idWorkout][exercise.name]).sort((a, b) => {
                        a = a[0].split('-').reverse().join('');
                        b = b[0].split('-').reverse().join('');
                        return a > b ? 1 : a < b ? -1 : 0;  //sort the dates
                    }).at(-1)];    //array of the [weight, reps] for each sets of the exercise w_name on the last session

                    if (arrayExerciseLastSessionhistory) {    //if != undefined, it means there is a previous logged workout, so we take those weights
                        let max_weight = arrayExerciseLastSessionhistory.reduce((a, e) => { if (a < e[0]) a = e[0]; return a; }, 0);
                        tempDict[exercise.name] = [...Array(parseInt(exercise["sets"])).keys()].map((i) => { return [max_weight, exercise.reps] });
                    }
                    else {   //there are no previous workout, we take a default weight of 20 kg
                        tempDict[exercise["name"]] = [...Array(parseInt(exercise["sets"])).keys()].map((i) => { return [20, exercise.reps] });
                    }
                });

                setMessageType("success");  //Allow us to know that there are no logged workout on this day, to avoid to check again later
                handleClose();
                setNewWorkout(tempDict);

            }
            //Else, we initialize it to the default 20 kg
            else {
                let tempDict = {}
                savedWorkouts.filter((e) => { return e["id"] === idWorkout })[0]["exercises"].forEach((exercise, ind) => {
                    tempDict[exercise["name"]] = [...Array(parseInt(exercise["sets"])).keys()].map((i) => { return [20, exercise.reps] });
                });
                setMessageType("success"); //Allow us to know that there are no logged workout on this day, to avoid to check again later
                handleClose();
                setNewWorkout(tempDict);
            }

        }
    }, [savedWorkouts, history, date, idWorkout]);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if (sendToFirebase) {
            if (changeType === "add") {
                setLoadingAdd(true)
            } else if (changeType === "delete") {
                setLoadingDelete(true)
            }
        }
        else if (firebaseError) {
            setMessageType("error")
            handleClick(firebaseError)();
            dispatch({ type: "RESET_ERROR" })
            if (changeType === "add") {
                setLoadingAdd(false)
            } else if (changeType === "delete") {
                setLoadingDelete(false)
            }
        } else {
            setMessageType("success");
            if (changeType === "add") {
                handleClick("Log added successfully");
                setLoadingAdd(false)
                setMessageDuration(6000);
                setIdWorkout("");
            } else if (changeType === "delete") {
                handleClick("Log deleted successfully");
                setLoadingDelete(false)
            }

        }
    }, [sendToFirebase, user.history])

    const addNewInputACB = async (newWorkout, workoutId, date, type) => {
        setChangeType("add");
        let newHistory = JSON.parse(JSON.stringify(history))
        Object.keys(newWorkout).forEach((ex_name) => {
            if (newWorkout[ex_name].length > 0)
                newHistory[workoutId][ex_name][date] = newWorkout[ex_name];
            else if (type === "update")
                delete newHistory[workoutId][ex_name][date];

        });

        const newUser = { ...user, history: historyEncoder(newHistory) }
        dispatch({ type: "SET_USER_INFO", payload: newUser })
    }

    const deleteInputACB = async (new_workout, workoutId, date) => {
        setChangeType("delete");
        let newHistory = JSON.parse(JSON.stringify(history))
        Object.keys(new_workout).forEach((ex_name) => {
            delete newHistory[workoutId][ex_name][date];
        });

        const newUser = { ...user, history: historyEncoder(newHistory) }
        dispatch({ type: "SET_USER_INFO", payload: newUser })
    }

    function setNewWorkoutFromEventACB(editedWorkout) {
        let error = checkInputFormatACB(editedWorkout);
        setInputError(error);
        if (error.length > 0) {
            let text = "";
            if (error.includes("NaN") || error.includes("<1")) text += "Please enter numbers greater than 1. ";
            if (error.includes("SetNotInteger")) text += "Number of reps should be integers. "
            setMessageType("error");
            handleClick(text);
            setMessageDuration(1000000);
        }
        else {
            setMessageDuration(0);
        }

        setNewWorkout(editedWorkout);
    }

    function changeWorkoutACB(event) {
        setIdWorkout(event.target.value);
        setNewWorkout(null);
    };


    function addSetACB(event) {
        const name = event.target.name;

        let exercise = savedWorkouts.filter((e) => { return e["id"] === idWorkout })[0]["exercises"].filter((e) => { return e.name === name })[0];

        let values = history[idWorkout][name];

        let new_dict = JSON.parse(JSON.stringify(newWorkout))

        if (new_dict[name].length > 0)
            new_dict[name].push(new_dict[name].at(-1));
        else if (Object.keys(values).length === 0)
            new_dict[name].push([20, exercise.reps]);
        else
            new_dict[name].push([values[Object.keys(values).at(-1)][0][0], exercise.reps]);
        setNewWorkout(new_dict);
    }

    function removeSetACB(event) {
        let new_dict = JSON.parse(JSON.stringify(newWorkout))
        new_dict[event.target.name].pop();
        setNewWorkout(new_dict);
    }

    const handleClick = (message) => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };


    function checkInputFormatACB(editedWorkout) {
        let error = [];

        Object.keys(editedWorkout).forEach((w_name) => {
            for (let i = 0; i < editedWorkout[w_name].length; i++) {
                for (let j = 0; j < 2; j++) {
                    editedWorkout[w_name][i][j] = editedWorkout[w_name][i][j].toString().replace(" ", "").replace(",", ".");
                    let number = Number(editedWorkout[w_name][i][j]);
                    if (isNaN(number)) {
                        if (!error.includes("NaN")) error.push("NaN");
                    }

                    if (number < 1) {
                        if (!error.includes("<1")) error.push("<1");
                    }

                    if (j === 1 && number.toString().replace(",", ".").indexOf(".") !== -1 && number.toString().replace(",", ".").indexOf(".") !== (number.toString().length - 1)) {
                        if (!error.includes("SetNotInteger")) error.push("SetNotInteger");
                    }
                }
            }
        });
        return error;
    }

    function addWorkoutACB() {
        addNewInputACB(newWorkout, idWorkout, date.format("DD-MM-YYYY"), "add");
        setMessageType("success");
        setMessageDuration(6000);
    }

    function updateWorkoutACB() {
        addNewInputACB(newWorkout, idWorkout, date.format("DD-MM-YYYY"), "update");
        setMessageDuration(6000);
    }

    function deleteWorkoutACB() {
        deleteInputACB(newWorkout, idWorkout, date.format("DD-MM-YYYY"));
    }

    return (
        <AddNewInputView
            savedWorkouts={savedWorkouts}
            history={history}
            loadingAdd={loadingAdd}
            loadingDelete={loadingDelete}
            id_workout={idWorkout}
            sliderType={sliderType}
            date={date}
            newWorkout={newWorkout}
            openSnackBar={openSnackBar}
            messageInfo={messageInfo}
            messageType={messageType}
            setMessageInfo={setMessageInfo}
            messageDuration={messageDuration}
            setNewWorkoutFromEvent={setNewWorkoutFromEventACB}
            setSliderType={setSliderType}
            changeWorkout={changeWorkoutACB}
            addSet={addSetACB}
            removeSet={removeSetACB}
            addWorkout={addWorkoutACB}
            updateWorkout={updateWorkoutACB}
            deleteWorkout={deleteWorkoutACB}
            handleClose={handleClose}
            setDate={setDate}
            inputError={inputError}
        />
    );
}

export default AddNewInput;