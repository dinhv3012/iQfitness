import {
  IconButton,
  InputAdornment,
  Box,
  TextField,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import ModalComp from "../components/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaCheck } from "react-icons/fa";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ProfilePageView({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  email,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onChangeEmail,
  onChangePassword,
  onHandleReauth,
  setError,
  loading,
  emailLoading,
  infoMessage,
  setInfoMessage,
  error,
  setReAuth,
  reAuth,
  onNameChangeACB,
  emailError,
  setEmailError,
  pwdError,
  setPwdError,
  pwdLoading,
  handleReAuthPwdChange,
  matches,
  showPassword,
  showConPassword,
  showReAuthPassword,
  setShowReAuthPassword,
  setShowPassword,
  setShowConPassword,
  showSuccessMsg
}) {
  return (
    <Container component="main" maxWidth="large">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        marginTop={3}
        marginBottom={2}
      >
        <Grid item xs={10}>
          <Typography variant="h5" component="h1">
            Profile Page
          </Typography>
        </Grid>
        {showSuccessMsg && <Grid item xs={5}>
          <Typography variant="h6" component="h6" color="green" fontWeight="bold">
            Changes were successfully made
          </Typography>
        </Grid>}
      </Grid>
      <Box component="form" noValidate onSubmit={onNameChangeACB} >
        <Grid container direction="column" justifyContent="center" alignItems="center" marginBottom={1}>
          <Typography variant="h6" component="div">
            Change name and lastname
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={10}>
            <TextField
              label="First Name"
              variant="outlined"
              required
              value={firstName}
              onChange={(event) => {
                setError("")
                onFirstNameChange(event)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              label="Last Name"
              variant="outlined"
              required
              value={lastName}
              onChange={(event) => {
                setError("")
                onLastNameChange(event)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            {error && <div className="login-error">{error}</div>}
          </Grid>
          <Grid item xs={10}>
            <LoadingButton
              variant="contained"
              color="primary"
              // type="submit"
              fullWidth
              loading={loading}
              onClick={onNameChangeACB}
            >
              Save Name Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      <Box component="form" noValidate onSubmit={onChangeEmail} marginTop={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center" marginBottom={1}>
          <Typography variant="h6" component="div">
            Change email address
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={10} sm={10}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(event) => {
                setEmailError("")
                onEmailChange(event)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={onChangeEmail}
                      disabled={emailLoading}
                    >
                      {emailLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <FaCheck />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {emailError && <div className="login-error">{emailError}</div>}
          </Grid>
        </Grid>
      </Box>

      <Box component="form" noValidate onSubmit={onChangePassword} marginTop={5}>
        <Grid container direction="column" justifyContent="center" alignItems="center" marginBottom={1}>
          <Typography variant="h6" component="div">
            Change Password
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={10} sm={10}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              placeholder="*********"
              onChange={(event) => {
                setPwdError("")
                onPasswordChange(event)
              }}
              onClick={() => setPwdError("")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={10} sm={10}>
            <TextField
              label="Confirm Password"
              type={showConPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              placeholder="*********"
              onChange={(event) => {
                setPwdError("")
                onConfirmPasswordChange(event)
              }}
              onClick={() => setPwdError("")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConPassword(!showConPassword)}
                    >
                      {showConPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {pwdError && <div className="login-error">{pwdError}</div>}
          </Grid>
          <Grid item xs={10} sm={10}>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              loading={pwdLoading}
            >
              change password
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        direction={matches ? "row" : "column"}
        justifyContent="center"
        alignItems="center"
        spacing={3}
        marginTop={2}
      >
        <Grid item xs={2}>
          <LoadingButton
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => setReAuth(true)}
          >
            Reauthenticate
          </LoadingButton>
        </Grid>
      </Grid>
      <ModalComp
        show={reAuth}
        setShow={setReAuth}
        title="Reauthenticate"
        info="Enter your password to reauthenticate"
      >
        <Box component="form" onSubmit={onHandleReauth} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            type={showReAuthPassword ? "text" : "password"}
            autoFocus
            onChange={handleReAuthPwdChange}
            onClick={() => setInfoMessage("")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowReAuthPassword(!showReAuthPassword)}
                  >
                    {showReAuthPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {infoMessage && (
            <Typography
              sx={{ margin: "0.5em 0", fontWeight: "bold" }}
            // variant="'body1'"
            >
              {infoMessage}
            </Typography>
          )}
          <LoadingButton
            sx={{ mt: 3 }}
            loading={loading}
            type="submit"
            variant="contained"
          >
            Log in
          </LoadingButton>
        </Box>
      </ModalComp>
    </Container>
  );
}

export default ProfilePageView;
