import React from "react";
import "./Styled.css";

import { Avatar, Container, TextField, InputAdornment,Snackbar, IconButton, Link, Grid, Typography, Box } from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

import LoadingButton from '@mui/lab/LoadingButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";


const RegisterView = ({
  handleSubmit,
  loading,
  setError,

  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,

  openSnackBar,
  messageInfoSnackBar,
  messageTypeSnackBar,
  handleCloseSnackBarACB,
  handleExitedSnackBarACB,

}) => {
  
  const handleSubmitACB = async (e) => {
    e.preventDefault();
    await handleSubmit(firstName, lastName, email, password, confirmPassword);
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmitACB} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(event) => setFirstName(event.target.value)}
                onClick={() => setError("")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={(event) => setLastName(event.target.value)}
                onClick={() => setError("")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                onClick={() => setError("")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                onClick={() => setError("")}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                onClick={() => setError("")}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="center" sx={{ marginTop: "1em" }}>
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
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

export default RegisterView;
