import React, { useState, useEffect } from "react";
import RegisterView from "../views/RegisterView";
import { useDispatch } from "react-redux";
import { createUserWithMail } from "../store/persistance/firebase";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmitACB = async (firstName, lastName, email, password, confirmPassword) => {
    // Validate user input
    if (!firstName && !lastName && !email && !password && !confirmPassword) {
      setError("Please enter all required fields");
    }
    else if (!firstName) {
      setError("Please enter your first name");
    }
    else if (!lastName) {
      setError("Please enter your last name");
    }
    else if (!email) {
      setError("Please enter your email address");
    }
    else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
    }
    else if (!password) {
      setError("Please enter a password");
    }
    else if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
    }
    else if (password !== confirmPassword) {
      setError("Passwords do not match");
    }

    // register user, fetch user credentials and then navigate to home page
    else if (error.length === 0) {
      try {
        setLoading(true)
        await dispatch(createUserWithMail({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        })); // Awaiting so that we can catch errors and set error message
        setLoading(false)
        window.location.href = "/"
      }
      catch (error) {
        setLoading(false)
        if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address");
          setMessageTypeSnackBar("error");
          createSnackPackMessage("Please enter a valid email address")();
        }
        else {
          setError(error.code);
          setMessageTypeSnackBar("error");
          createSnackPackMessage(error.code)();
        }
      }
    }

    if (error !== "") {
      setMessageTypeSnackBar("error");
      createSnackPackMessage(error)();
    }

  };

  return (
    <RegisterView
      handleSubmit={handleSubmitACB}
      loading={loading}
      setError={setError}

      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}

      openSnackBar={openSnackBar}
      messageInfoSnackBar={messageInfoSnackBar}
      messageTypeSnackBar={messageTypeSnackBar}
      handleCloseSnackBarACB={handleCloseSnackBarACB}
      handleExitedSnackBarACB={() => setMessageInfoSnackBar(undefined)}
    />
  );
};

export default Register;
