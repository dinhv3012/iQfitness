import { get, onValue, ref } from 'firebase/database';

const getRefs = (db, state) => {
    const path = `users/${state.user.userCredentials.uid}/`
    const userRef = ref(db, path)

    return userRef
}

const fromFirebaseDispatch = (userInfo, dispatch) => {
    dispatch(
        {
            type: "SET_USER_INFO",
            payload: userInfo
        }
    )
}

const fromFirebase = async (db, state, dispatch) => {
    const userRef = getRefs(db, state)
    const snapShot = await get(userRef)
    const userInfo = snapShot.val()

    fromFirebaseDispatch(userInfo, dispatch)
}

const firebaseSub = async (db, state, dispatch) => {
    const userRef = getRefs(db, state)
    const unSub = onValue(userRef, async snapShot => {
        const userInfo = snapShot.val()
        fromFirebaseDispatch(userInfo, dispatch)
    })
    return unSub
}

export default { fromFirebase, firebaseSub }
