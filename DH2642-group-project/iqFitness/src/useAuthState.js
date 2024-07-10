import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthState = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return user
        }
        else {
            return null
        }
    });

}

export default useAuthState;