import { getDatabase } from "firebase/database"
import { changeUserEmail, updateDocInDB } from "./firebase"
import userPersistance from "./persistor/users"

export const persistance = (store, firebaseApp) => {
    let previousState = store.getState()
    const previousUser = JSON.parse(previousState.user?.userCredentials)
    const previousUserId = previousUser?.uid


    let unSubs = []
    const dispatch = store.dispatch

    const db = getDatabase(firebaseApp)


    store.subscribe(() => {
        const state = store.getState()
        const user = JSON.parse(state.user?.userCredentials)
        const userId = user?.uid

        const setFromFirebase = state.user?.setFromFirebase
        const sendToFirebase = state.user?.sendToFirebase

        if (userId && !previousUserId && setFromFirebase) {
            (async () => {
                const unSubFunction = await userPersistance.firebaseSub(db, state, dispatch)
                unSubs.push(unSubFunction)
            })();
        }

        const namesOrEmailChanged = () => {
            let updateObj = {}
            if (previousState.user?.userInfo?.firstName !== state.user?.userInfo?.firstName) {
                updateObj.firstName = state.user?.userInfo?.firstName
            }
            if (previousState.user?.userInfo?.lastName !== state.user?.userInfo?.lastName) {
                updateObj.lastName = state.user?.userInfo?.lastName
            }
            return Object.keys(updateObj).length > 0 ? updateObj : null
        }

        let newInfo = namesOrEmailChanged()


        if (newInfo && sendToFirebase) {
            (async () => {
                try {
                    await updateDocInDB("users", userId, newInfo)
                    dispatch({ type: "FIREBASE_UPDATED" })
                }
                catch (error) {
                    dispatch({ type: "SET_FIREBASE_ERROR", payload: error })
                    dispatch({ type: "CHANGE_EMAIL", payload: state.user?.userInfo?.oldEmail })
                }
            })()

        }

        if (previousState.user?.userInfo?.savedWorkouts !== state.user?.userInfo?.savedWorkouts && sendToFirebase) {
            (async () => {
                try {
                    await updateDocInDB("users", userId, { savedWorkouts: state.user?.userInfo?.savedWorkouts })
                    dispatch({ type: "FIREBASE_UPDATED" })
                }
                catch (error) {
                    dispatch({ type: "SET_FIREBASE_ERROR", payload: error })
                }
            })()
        }

        if (previousState.user?.userInfo?.history !== state.user?.userInfo?.history && sendToFirebase) {
            (async () => {
                try {
                    await updateDocInDB("users", userId, { history: state.user?.userInfo?.history })
                    dispatch({ type: "FIREBASE_UPDATED" })
                }
                catch (error) {
                    dispatch({ type: "SET_FIREBASE_ERROR", payload: error })
                }
            })()
        }

        if (previousUserId && !userId) {
            unSubs.forEach(unSub => unSub())
        }

        previousState = store.getState()
    })
}