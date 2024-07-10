const user = (state = { userCredentials: null, userInfo: null, sendToFirebase: false, setFromFirebase: false, firebaseError: null }, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, userCredentials: action.payload.userCredentials, userInfo: action.payload.userInfo, setFromFirebase: true }
        case 'LOGOUT':
            return { userCredentials: null, userInfo: null, sendToFirebase: false, setFromFirebase: false, firebaseError: null }
        case 'CHANGE_EMAIL':
            return { ...state, userInfo: { ...state.userInfo, email: action.payload } }
        case 'OLD_EMAIL':
            return { ...state, userInfo: { ...state.userInfo, oldEmail: action.payload } }
        case 'SET_USER_INFO':
            return { ...state, userInfo: action.payload, sendToFirebase: true } // NOTE! will replace all userInfo with action.payload
        case 'FIREBASE_UPDATED':
            return { ...state, sendToFirebase: false }
        case 'SET_FIREBASE_ERROR':
            return { ...state, firebaseError: action.payload, sendToFirebase: false }
        case 'RESET_ERROR':
            return { ...state, firebaseError: null }
        default:
            return state
    }
}

export default user;