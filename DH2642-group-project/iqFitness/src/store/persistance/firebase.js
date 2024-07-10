// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getFirestore, setDoc, getDoc, doc, updateDoc } from 'firebase/firestore/lite';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signOut,
    reauthenticateWithCredential,
    updateEmail,
    EmailAuthProvider,
    onAuthStateChanged
} from "firebase/auth";
import config from '../../config.json';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

const firebaseConfig = config.firebaseConfig
export const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);

export const addDocToDB = async (collectionName, data) => {
    try {
        if (data.id) {
            await setDoc(doc(db, collectionName, data.id), {
                ...data,
            });
        }
        else {
            throw new Error(`Server error, contact admin support. Reason: no id provided`);
        }
    }
    catch (error) {
        throw error;
    }
}

export const updateDocInDB = async (collectionName, docId, updateFields) => {
    try {
        const docRef = doc(db, collectionName, docId)
        await updateDoc(docRef, updateFields)
    }
    catch (error) {
        throw error
    }
}

export const getDBData = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        else {
            throw new Error(`404 not found`);
        }
    }
    catch (error) {
        throw error;
    }
}

export const firebaseLoader = (loadingSetter, errorSetter, dispatch, sendToFirebase, firebaseError) => {
    if (sendToFirebase) {
        loadingSetter(true)
    } else if (firebaseError) {
        errorSetter(firebaseError.code)
        dispatch({ type: "RESET_ERROR" })
        loadingSetter(false)
    }
    else {
        loadingSetter(false)
    }
}

export const createUserWithMail = (userData) => async (dispatch) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        await sendEmailVerification(userCredential.user);
        const dbData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            id: userCredential.user.uid,
            savedWorkouts: [],
            history: {},
        }
        await addDocToDB("users", dbData);
        dispatch({
            type: "LOGIN", payload: {
                userCredentials: JSON.stringify(userCredential.user),
                userInfo: dbData
            }
        });
    }
    catch (error) {
        throw error;
    }
}

export const signInWithMail = (email, password) => async (dispatch) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const dbData = await getDBData("users", userCredential.user.uid);
        dispatch({
            type: "LOGIN", payload: {
                userCredentials: JSON.stringify(userCredential.user),
                userInfo: dbData
            }
        });
    }
    catch (error) {
        throw error;
    }
}

export const logOut = () => async (dispatch) => {
    try {
        dispatch({ type: "LOGOUT" });
        dispatch({ type: "CLEAR_STATE" });
        await signOut(auth);
    }
    catch (error) {
        throw error;
    }
}


export const changeUserEmail = (newEmail) => async (dispatch) => {
    try {
        const user = auth.currentUser
        if (user) {
            await updateEmail(auth.currentUser, newEmail)
            dispatch({ type: "CHANGE_EMAIL", payload: newEmail })
        }
        else {
            throw new Error("Please reauthenticate your user session by pressing the reauthenticate button")
        }
    } catch (error) {
        throw error
    }
}

export const changePassword = async (newPassword) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            return auth.currentUser
        }
        else {
            throw new Error("Please reauthenticate your user session by pressing the reauthenticate button");
        }
    }
    catch (error) {
        throw error;
    }
}

export const resetPassword = async (email) => {
    try {
        const status = await sendPasswordResetEmail(auth, email);
        return { status: status, message: "Password reset email sent" };
    }
    catch (error) {
        throw error;
    }
}

export const reAuthenticateUser = async (password) => {
    try {
        let counter = 0;
        while (!auth.currentUser && counter < 60) {
            await new Promise(r => setTimeout(r, 1000));
            counter++;
        }
        if (counter === 60) {
            throw new Error("Error, refresh and try again");
        }
        const credentials = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credentials);
    } catch (error) {
        throw error;
    }
}


export const getUserAuthStatus = () => async (dispatch) => {
    try {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                return dispatch({ type: "LOGOUT" });
            }
        })
    }
    catch (error) {
        throw error;
    }
}
