import React, { useState, useEffect } from "react";
import ProfilePageView from "../views/ProfilePageView";
import { reAuthenticateUser, changePassword } from "../store/persistance/firebase";
import { useSelector, useDispatch } from "react-redux";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { firebaseLoader } from "../store/persistance/firebase"
import { changeUserEmail } from "../store/persistance/firebase";
import { updateDocInDB, getDBData } from "../store/persistance/firebase";

const ProfilePage = () => {
  const user = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo : null
  )
  const sendToFirebase = useSelector((state) => state.user.sendToFirebase)
  const firebaseError = useSelector((state) => state.user.firebaseError ? state.user.firebaseError : null)

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [buttonPressed, setButtonPressed] = useState("")

  const [reAuthPassword, setReAuthPassword] = useState("");

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [showReAuthPassword, setShowReAuthPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [infoMessage, setInfoMessage] = useState("");
  const [reAuth, setReAuth] = useState(false);

  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const dispatch = useDispatch();


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setLoading(false);
    }

  }, [user, user.firstName, user.lastName, user.email]);

  useEffect(() => {
    if (buttonPressed === "name") {
      firebaseLoader(setLoading, setError, dispatch, sendToFirebase, firebaseError)
    }
  }, [sendToFirebase, user.firstName, user.lastName])


  const handleFirstNameChange = async (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = async (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = async (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = async (event) => {
    setPassword(event.target.value);
  };
  const handleReAuthPwdChange = async (event) => {
    setReAuthPassword(event.target.value);
  };
  const handleConfirmPasswordChange = async (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleReAuthACB = async (e) => {
    e.preventDefault();
    if (!reAuthPassword) {
      setInfoMessage("Please enter the password");
    } else if (!validatePassword(reAuthPassword)) {
      setInfoMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    } else {
      try {
        setLoading(true);
        await reAuthenticateUser(reAuthPassword);
        setInfoMessage("Reauthenticated");
        setLoading(false);
        setTimeout(() => {
          setReAuth(false);
        }, 500);
      } catch (error) {
        setInfoMessage(error.code);
        setLoading(false);
      }
    }
  };

  const onNameChange = () => {
    if (!firstName) {
      setError("Please enter your first name");
      return;
    } else if (!lastName) {
      setError("Please enter your last name");
    }
    else if (firstName === user.firstName && lastName === user.lastName) {
      setError("Please enter a different name");

    } else if (error === "") {
      setButtonPressed("name")
      const updates = {};
      if (firstName !== user.firstName) {
        updates.firstName = firstName;
      }
      if (lastName !== user.lastName) {
        updates.lastName = lastName;
      }
      dispatch({ type: "SET_USER_INFO", payload: { ...user, ...updates } });
    }
  }

  const onChangeEmailACB = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Please enter your email address");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    }
    else if (email === user.email) {
      setEmailError("Please enter a different email address");
    }
    else if (error === "") {
      setEmailLoading(true);
      try {
        await dispatch(changeUserEmail(email))
        await updateDocInDB("users", user.id, { "email": email });

        const newUser = await getDBData("users", user.id);
        dispatch({ type: "SET_USER_INFO", payload: newUser });

        setEmailLoading(false);
        setShowSuccessMsg(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setShowSuccessMsg(false)
      } catch (error) {
        setEmailError(error.code);
        setEmailLoading(false);
      }
    }
  };

  const onChangePasswordACB = async (e) => {
    e.preventDefault();
    if (!password) {
      setPwdError("Please enter a password");
    } else if (!validatePassword(password)) {
      setPwdError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    } else if (password !== confirmPassword) {
      setPwdError("Passwords do not match");
    } else if (error === "") {
      try {
        setPwdLoading(true);
        await changePassword(password);
        setPwdLoading(false);
        setShowSuccessMsg(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setShowSuccessMsg(false)
      } catch (error) {
        setPwdError(error.code);
        setPwdLoading(false);
      }
    }
    else {
      setPwdLoading(false)
    }
  };


  useEffect(() => {
    if (reAuth) {
      setInfoMessage("")
    }
  }, [reAuth])

  return (
    <ProfilePageView
      firstName={firstName}
      onFirstNameChange={handleFirstNameChange}
      lastName={lastName}
      onLastNameChange={handleLastNameChange}
      email={email}
      onEmailChange={handleEmailChange}
      password={password}
      onPasswordChange={handlePasswordChange}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onChangeEmail={onChangeEmailACB}
      onChangePassword={onChangePasswordACB}
      setEmail={setEmail}
      onHandleReauth={handleReAuthACB}
      setError={setError}
      loading={loading}
      emailLoading={emailLoading}
      infoMessage={infoMessage}
      setInfoMessage={setInfoMessage}
      error={error}
      reAuth={reAuth}
      setReAuth={setReAuth}
      onNameChangeACB={onNameChange}
      emailError={emailError}
      setEmailError={setEmailError}
      setPwdError={setPwdError}
      pwdError={pwdError}
      pwdLoading={pwdLoading}
      handleReAuthPwdChange={handleReAuthPwdChange}
      matches={matches}
      showPassword={showPassword}
      showConPassword={showConPassword}
      showReAuthPassword={showReAuthPassword}
      setShowPassword={setShowPassword}
      setShowConPassword={setShowConPassword}
      setShowReAuthPassword={setShowReAuthPassword}
      showSuccessMsg={showSuccessMsg}
    />
  );
};

export default ProfilePage;
