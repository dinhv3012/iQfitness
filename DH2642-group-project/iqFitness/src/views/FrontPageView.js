import React from "react";
import homePageImg from "../img/home_page_img.png";
import homeInfoImg1 from "../img/calendar.png"
import homeInfoImg2 from "../img/devices.png"
import homeInfoImg3 from "../img/personalized.png"
import Grid from '@mui/material/Grid';
import { Button, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import "./Styled.css";


const FrontPageView = () => {

    const registerClickCB = () => {
        window.location.href = "/register"
    }


    return (
        <Box >
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                sx={{ padding: "0 2em" }}
                spacing={4}
            >
                <Grid item>
                    <Grid container
                        direction="row"
                        justifyContent="space-around">
                        <Grid item xs={10}>
                            <Typography variant="h3" component="div">
                                It's Time to Have the Coach You Deserve
                            </Typography>
                            <Typography variant="h4" component="div">
                                Train anywhere and anytime with your personal coach, available 24/7
                            </Typography>
                            <Button sx={{ fontFamily: "inherit", fontSize: "1.5em", padding: "0.5em 1.5em", margin: "0.5em 0.5em 0.5em 0", borderRadius: "0.8em", color: "white" }} variant="contained" onClick={registerClickCB}>Try It For Free</Button>

                        </Grid>
                        <Grid item xs={10}>
                            <Grid container justifyContent="flex-end">
                                <img style={{ maxWidth: "35vw" }} src={homePageImg} alt="home_page_image" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-around"
                        alignItems="flex-end"
                        spacing={8}
                    >
                        <Grid item className="detail_container" >
                            <img className="detail_button" src={homeInfoImg1} alt="home_information_img_1" />
                            <div className="home_information_detail">
                                <div className="title">Custom Workouts 24/7</div>
                                <div className="detail">Get personalized workouts from your coach at anytime</div>
                            </div>
                        </Grid>
                        <Grid item className="detail_container">
                            <img className="detail_button" src={homeInfoImg2} alt="home_page_image_img_2" />
                            <div className="home_information_detail">
                                <div className="title">Access From Any Platform</div>
                                <div className="detail">Talk to your coach anywhere, on any device</div>
                            </div>
                        </Grid>
                        <Grid item className="detail_container">
                            <img className="detail_button" src={homeInfoImg3} alt="home_page_image_img_3" />
                            <div className="home_information_detail">
                                <div className="title">Personalized Service</div>
                                <div className="detail">Trust your coach, who knows you better than yourself</div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </Box>
    );
}

export default FrontPageView;