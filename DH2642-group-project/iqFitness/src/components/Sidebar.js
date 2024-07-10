import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, Button } from '@mui/material';
import { FaUserAlt, FaHome, FaDumbbell, FaPlus, FaSignOutAlt, FaSignInAlt, FaBars, FaChartLine } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from "../store/persistance/firebase";

export default function Sidebar() {
    const user = useSelector((state) => state.user.userCredentials ? state.user.userCredentials : null)
    const dispatch = useDispatch()

    const routes = ["/", "/workouts", "/log", "/history/workouts", "/profile",]
    const icons = [<FaHome />, <FaDumbbell />, <FaPlus />, <FaChartLine />, <FaUserAlt />,]

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setSidebarOpen(open);
    };

    const loginACB = () => {
        window.location.href = "/login"
    }

    const signOutACB = async () => {
        await dispatch(logOut())
        window.location.href = "/"
    }


    const list = () => (
        <Box
            sx={{ width: "16em", display: "flex", flexDirection: "column", alignItems: "center" }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Button variant="text" sx={{ color: "black", fontSize: "2.2em", paddingTop: "0.5em", textAlign: "center" }} onClick={() => window.location.href = "/"}>IQfitness</Button>
            <Box sx={{ display: "flex", margin: "0", flexDirection: "column", alignItems: "flex-start" }}>
                <List sx={{ margin: "0" }}>
                    {(user ? ["Home", "IQWorkouts", "Log Workout", "IQHistory", "Profile Page"] : ["Home"]).map((text, index) => (
                        <ListItem key={text}>
                            <ListItemButton onClick={() => window.location.href = routes[index]}>
                                <ListItemIcon >
                                    {icons[index]}
                                </ListItemIcon>
                                <ListItemText sx={{ margin: "0.2em" }} primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {user ? <ListItem >
                        <ListItemButton onClick={signOutACB}>
                            <ListItemIcon>
                                <FaSignOutAlt />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItemButton>
                    </ListItem> : <ListItem >
                        <ListItemButton onClick={loginACB}>
                            <ListItemIcon>
                                <FaSignInAlt />
                            </ListItemIcon>
                            <ListItemText primary="Log In" />
                        </ListItemButton>
                    </ListItem>
                    }
                </List>
            </Box>
        </Box >
    );

    return (
        <div>
            <Box>
                <IconButton onClick={toggleDrawer(true)}>
                    <FaBars style={{ fontSize: "1.2em", padding: "0.2em", borderRadius: "0.3em", position: "fixed", left: "0.5em", top: "0.5em", backgroundColor: "white", zIndex: "1000" }} />
                </IconButton>
                <Button sx={{
                    fontFamily: "inherit",
                    fontWeight: "0.5em",
                    margin: "1.5em 1.5em 1em 0",
                    borderRadius: "0.5em",
                    color: "white",
                    float: "right",
                    display: !(window.location.pathname === "/" && !user) && "none"
                }}
                    variant="contained" onClick={loginACB}>
                    Login
                </Button>
            </Box>
            <React.Fragment >
                <SwipeableDrawer
                    anchor={"left"}
                    open={sidebarOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <Box sx={{ zIndex: "10" }}>{list()}</Box>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}