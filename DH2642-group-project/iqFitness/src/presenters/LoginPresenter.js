import React, { useState, useEffect } from "react";
import LoginView from "../views/LoginView";
import { signInWithMail, resetPassword } from "../store/persistance/firebase";
import { useDispatch } from "react-redux";

const LoginPresenter = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("")

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("")

  const [snackPack, setSnackPack] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageInfoSnackBar, setMessageInfoSnackBar] = useState(undefined);
  const [messageTypeSnackBar, setMessageTypeSnackBar] = useState(undefined);

  const dispatch = useDispatch();

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

  const createSnackPackMessage = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleCloseSnackBarACB = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const handleSubmitACB = async (email, password) => {
    if (!email && !password) {
      setError("Please enter both email and password");
    }
    else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
    }
    else if (!password) {
      setError("Please enter a password");
    }
    else {
      if (error === "") {
        try {
          setLoading(true)
          await dispatch(signInWithMail(email, password)); // Awaiting so that we can catch errors and set error message
          setLoading(false)
          window.location.href = "/"
        }
        catch (error) {
          setLoading(false)
          if (error.code === "auth/user-not-found") {
            setError("Email address not found, please register");
            setMessageTypeSnackBar("error");
            createSnackPackMessage("Incorrect email or password")();
          }
          else if (error.code === "auth/wrong-password") {
            setError("Incorrect password");
            setMessageTypeSnackBar("error");
            createSnackPackMessage("Incorrect email or password")();
          }
          else if (error.code === "auth/too-many-requests") {
            setError("too many failed logins, please wait 30s and try again");
            setMessageTypeSnackBar("error");
            createSnackPackMessage("too many failed logins, please wait 30s and try again")();
          }
          else {
            setError(error.code);
            setMessageTypeSnackBar("error");
            createSnackPackMessage(error.code)();
          }
        }
      }
    }

    if (error !== "") {
      setMessageTypeSnackBar("error");
      createSnackPackMessage(error)();
    }
  };

  const handleResetPasswordACB = async (email) => {
    if (!email) {
      setInfoMessage("Please enter an email address");
    }
    else if (!validateEmail(email)) {
      setInfoMessage("Please enter a valid email address");
    }
    else if (error === "") {
      try {
        setLoading(true)
        await resetPassword(email);
        setInfoMessage("Password reset email sent");
        setLoading(false)
      }
      catch (error) {
        setInfoMessage(error.code);
        setLoading(false)
      }
    }
  };


  return (
    <LoginView
      setError={setError}
      error={error}
      infoMessage={infoMessage}
      setInfoMessage={setInfoMessage}
      handleSubmit={handleSubmitACB}
      handleResetPassword={handleResetPasswordACB}
      loading={loading}

      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showResetPassword={showResetPassword}
      setShowResetPassword={setShowResetPassword}
      resetEmail={resetEmail}
      setResetEmail={setResetEmail}

      openSnackBar={openSnackBar}
      messageInfoSnackBar={messageInfoSnackBar}
      messageTypeSnackBar={messageTypeSnackBar}
      handleCloseSnackBarACB={handleCloseSnackBarACB}
      handleExitedSnackBarACB={() => setMessageInfoSnackBar(undefined)}
    />
  );
};

export default LoginPresenter;
