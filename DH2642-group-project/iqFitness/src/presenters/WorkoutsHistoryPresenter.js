import React, { useState, useEffect } from "react";
import WorkoutsHistoryView from "../views/WorkoutsHistoryView";
import { useDispatch, useSelector } from 'react-redux';
import { historyDecoder, historyEncoder } from "../actions/historyConversion";
import { getDBData, updateDocInDB } from "../store/persistance/firebase";

const WorkoutsHistory = () => {

    const [allHistory, setAllHistory] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState({});
    const [workoutId, setWorkoutId] = useState(null);
    const [savedWorkouts, setSavedWorkouts] = useState([])
    const [loading, setLoading] = useState(true);
    const [exercise, setExercise] = useState("-1");
    const [numSet, setNumSet] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState({});   //{ type:"1" or "2", title:"title message", content:"content message", button1:"button1 text", button2:"button2 text"
    const [selectedDate, setSelectedDate] = useState("");
    const [snackPack, setSnackPack] = useState([]);
    const [openMessageSnackBar, setOpenMessageSnackBar] = useState(false);
    const [messageInfoSnackBar, setMessageInfoSnackBar] = useState(undefined);
    const [messageTypeSnackBar, setMessageTypeSnackBar] = useState(undefined);


    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.userInfo ? state.user.userInfo : null)

    useEffect(() => {
        if (user) {
            setSavedWorkouts(user.savedWorkouts);
            setAllHistory(historyDecoder(user.history))
            setLoading(false);
            setWorkoutId(Object.keys(user.history)[0]);
        }
    }, [user, user.savedWorkouts, user.history,])


    function newWorkoutSelectACB(id) {
        setWorkoutId(id);
    }

    useEffect(() => {
        if (allHistory !== null && workoutId !== null) {
            if (allHistory[workoutId] !== undefined) setWorkoutHistory(allHistory[workoutId]);
            else setWorkoutHistory({});
        }
    }, [workoutId, allHistory]);


    useEffect(() => {
        if (snackPack.length && !messageInfoSnackBar) {
            // Set a new snack when we don't have an active one
            setMessageInfoSnackBar({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpenMessageSnackBar(true);
        } else if (snackPack.length && messageInfoSnackBar && openMessageSnackBar) {
            // Close an active snack when a new one is added
            setOpenMessageSnackBar(false);
        }
    }, [snackPack, messageInfoSnackBar, openMessageSnackBar]);


    const deleteInputACB = async (exercises, workoutId, date) => {
        let newHistory = JSON.parse(JSON.stringify(allHistory))
        exercises.forEach((ex_name) => {
            delete newHistory[workoutId][ex_name][date];
        });

        try {
            // setLoading(true)
            await updateDocInDB("users", user.id, { "history": historyEncoder(newHistory) });
            const newUser = await getDBData("users", user.id);
            dispatch({ type: "SET_USER_INFO", payload: newUser })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const setIdACB = (event) => {
        setWorkoutId(event.target.value);
        newWorkoutSelectACB(event.target.value);
    };

    const handleChange = (event, newValue) => {
        setExercise(newValue);
        setNumSet(0);
    };

    const handleChangeNumSet = (event, newValue) => {
        setNumSet(newValue);
    };

    function find_idCB(e) {
        return e["id"] === workoutId;
    }


    const createSnackPackMessage = (message) => () => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenMessageSnackBar(false);
    };


    function handleCloseDialogACB() {
        setOpenDialog(false);
    }

    function handleActionDialogACB(event) {
        const text_clicked = event.target.textContent;
        if (dialogData.type === "1") {
            if (text_clicked === "Modify") {
                setOpenDialog(false);
                window.location.href = "../log/" + workoutId + "_" + selectedDate;
            }
            else if (text_clicked === "Delete") {
                setOpenDialog(false);
                setDialogData({
                    type: "2",
                    title: "Delete the input: " + selectedDate,
                    content: "Are you sur to delete this logged workout ?",
                    button1: "Delete",
                    button2: "Cancel",
                });
                setOpenDialog(true);
            }
        }
        else if (dialogData.type === "2") {
            if (text_clicked === "Delete") {
                setOpenDialog(false);
                setMessageTypeSnackBar("success");
                createSnackPackMessage("Input deleted")();
                deleteInputACB(savedWorkouts.find(find_idCB).exercises.reduce((a, e) => { a.push(e.name); return a }, []), workoutId, selectedDate);
            }
            else if (text_clicked === "Cancel") {
                setOpenDialog(false);
                setDialogData({});
            }
        }
    }

    function handleClickDateAxisACB(event) {
        //Implementation to improve in the futur
        return
        // setSelectedDate(event.value);
        // setOpenDialog(true);
        // setDialogData({
        //     type: "1",
        //     title: "Input selected: " + selectedDate,
        //     content: "What do you want to do ?",
        //     button1: "Modify",
        //     button2: "Delete",
        // });
    }

    return (
        <div>
            <WorkoutsHistoryView
                savedWorkouts={savedWorkouts}
                workoutHistory={workoutHistory}
                loading={loading}
                workoutId={workoutId}
                setIdACB={setIdACB}
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
                handleExitedSnackBarACB={() => setMessageInfoSnackBar(undefined)}
            />
        </div>
    );

}

export default WorkoutsHistory;