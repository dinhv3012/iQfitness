import * as api from "../api/exerciseApi.js"

export const getExercises = (name, type, muscle, difficulty) => async (dispatch) => {
    try {
        const { data } = await api.getExercises(name, type, muscle, difficulty);
        return dispatch({ type: "GET_EXERCISES", payload: data });
    } catch (error) {
        throw (error.message);
    }
}

export const pickExercise = (exercise) => async (dispatch) => {
    try {
        return dispatch({ type: "PICK_EXERCISE", payload: exercise });
    } catch (error) {
        throw (error.message);
    }
}

export const unPickExercise = (exercise) => async (dispatch) => {
    try {
        return dispatch({ type: "UNPICK_EXERCISE", payload: exercise });
    } catch (error) {
        throw (error.message);
    }
}

export const updateWorkoutName = (name) => async (dispatch) => {
    try {
        return dispatch({ type: "UPDATE_WORKOUT_NAME", payload: name });
    } catch (error) {
        throw (error.message);
    }
}

export const updateWorkoutId = (id) => async (dispatch) => {
    try {
        return dispatch({ type: "UPDATE_WORKOUT_ID", payload: id.toString() });
    } catch (error) {
        throw (error.message);
    }
}