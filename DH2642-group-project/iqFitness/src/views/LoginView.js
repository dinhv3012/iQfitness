import React from "react";
import "./Styled.css";

import { Avatar, Container, TextField, InputAdornment,Snackbar, IconButton, Link, Grid, Typography, Box } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

import ModalComp from "../components/Modal";
import LoadingButton from '@mui/lab/LoadingButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";


const LoginView = ({
  setError,
  error,
  infoMessage,
  setInfoMessage,
  handleSubmit,
  handleResetPassword,
  loading,

  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  showResetPassword,
  setShowResetPassword,
  resetEmail,
  setResetEmail,

  openSnackBar,
  messageInfoSnackBar,
  messageTypeSnackBar,
  handleCloseSnackBarACB,
  handleExitedSnackBarACB,

}) => {

  

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  const handleSubmitACB = async (e) => {
    e.preventDefault();
    await handleSubmit(email, password);
  }

  const resetPasswordACB = async (e) => {
    e.preventDefault();
    await handleResetPassword(resetEmail);
  }

  const onChangeEmailACB = (event) => {
    setEmail(event.target.value);
    setError("");
  }

  const onChangePasswordACB = (event) => {
    setPassword(event.target.value);
    setError("");
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmitACB} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onChangeEmailACB}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            onChange={onChangePasswordACB}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>,
            }}
          />
          <LoadingButton sx={{ mt: 3, mb: 2 }} fullWidth loading={loading} type='submit' variant="contained" >
            Sign In
          </LoadingButton>
          <Grid container sx={{ marginTop: "1em" }}>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={() => setShowResetPassword(true)}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ModalComp show={showResetPassword} setShow={setShowResetPassword} title="Reset Password" info="Enter the email address to the account to reset the password">
        <Box component="form" onSubmit={resetPasswordACB} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(event) => setResetEmail(event.target.value)}
            onClick={() => setInfoMessage("")}
          />
          {infoMessage &&
            <Typography sx={{ margin: "0.5em 0", fontWeight: "bold" }} variant="body1">
              {infoMessage}
            </Typography>
          }
          <LoadingButton sx={{ mt: 3 }} loading={loading} type='submit' variant="contained" >
            Reset Password
          </LoadingButton>
        </Box>
      </ModalComp>
      <Snackbar
        key={messageInfoSnackBar ? messageInfoSnackBar.key : undefined}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBarACB}
        TransitionProps={{ onExited: handleExitedSnackBarACB }}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackBarACB}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          onClose={handleCloseSnackBarACB}
          severity={messageTypeSnackBar}
          sx={{ width: "100%" }}
        >
          {messageInfoSnackBar ? messageInfoSnackBar.message : undefined}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginView;
