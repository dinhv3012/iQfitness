const exercises = (state = { lastSearch: [], currentPicked: [], workoutName: "" }, action) => {
    switch (action.type) {
        case 'GET_EXERCISES':
            return {
                ...state,
                lastSearch: action.payload
            }
        case 'PICK_EXERCISE':
            return {
                ...state,
                currentPicked: [...state.currentPicked, action.payload]
            }
        case 'UNPICK_EXERCISE':
            return {
                ...state,
                currentPicked: state.currentPicked.filter((exercise) => exercise !== action.payload)
            }
        case 'UPDATE_WORKOUT_NAME':
            return {
                ...state,
                workoutName: action.payload
            }
        case 'UPDATE_WORKOUT_ID':
            return {
                ...state,
                workoutId: action.payload
            }
        case "CLEAR_STATE":
            return {
                lastSearch: [],
                currentPicked: [],
                workoutName: "",
            }
        default:
            return state;
    }
}

export default exercises;