
import React from "react";
import "./Styled.css";

import { Grid, Box, Tabs, Tab } from '@mui/material';

import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TimeChart from "../components/TimeChart";

const WorkoutsHistoryDetailsView = ({
    workoutHistory,
    exercise,
    numSet,
    handleChange,
    handleChangeNumSet,
    openDialog,
    dialogData,
    handleCloseDialogACB,
    handleActionDialogACB,
    handleClickDateAxisACB,
    selectedDate,
    openMessageSnackBar,
    messageInfoSnackBar,
    messageTypeSnackBar,
    handleCloseSnackBar,
    handleExitedSnackBarACB,
}) => {

    function createDataCB(e) {
        let res = { "date": e[0] }
        for (let i = 0; i < e[1].length; i++) {
            res["set " + (i + 1)] = e[1][i];
        }
        return res;
    }

    function compute_rep_max(arrs) {
        //from an array [[kg, reps], [kg, reps], ... ] of the sets performances, we return the biggest 1 rep max equivalent
        return Math.max(...arrs.reduce((a, e) => { a.push(e[0] * (1 + parseInt(e[1]) / 30)); return a; }, [0]));
    }

    // Use the data in workoutHistory props to built with the good foramt the dataset which will be plotted
    let days;
    if (workoutHistory !== null) {
        const keys = Object.keys(workoutHistory)

        days = keys.reduce((a, e) => {
            Object.keys(workoutHistory[e]).forEach((f) => {
                if (!a.includes(f)) a.push(f);
            });
            return a;
        }, []);
        days.sort(function (a, b) {   //sort dates
            a = a.split('-').reverse().join('');
            b = b.split('-').reverse().join('');
            return a > b ? 1 : a < b ? -1 : 0;
        });

        if (exercise !== "-1") var number_of_sets = Object.values(workoutHistory[exercise]).reduce((a, e) => { a = Math.max(a, e.length); return a; }, 0);
        else {
            var num_days = Math.max(...Object.keys(workoutHistory).reduce((a, f) => { a.push(Object.keys(workoutHistory[f]).length); return a; }, []));
            var num_exercises = Object.keys(workoutHistory).length;
            var reps_max = Array(num_days).fill(null).map(() => Array(num_exercises).fill(null)); //create a num_days x num_exercises empty array

            //built the matrix of one rep max equivalent
            const first_values = new Array(num_exercises).fill(null);
            for (let e = 0; e < keys.length; e++) {
                for (let d = 0; d < days.length; d++) {
                    if (workoutHistory[keys[e]][days[d]]) {
                        reps_max[d][e] = compute_rep_max(workoutHistory[keys[e]][days[d]]);
                        if (first_values[e] === null && reps_max[d][e] !== 0) first_values[e] = reps_max[d][e];
                    }
                }
            }

            //convert it to percentage of improvement, in comparison to the first value
            for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < days.length; j++) {
                    if (reps_max[j][i] !== null){
                        if(first_values[i] !== null)
                            reps_max[j][i] = parseFloat(((reps_max[j][i] / first_values[i] - 1) * 100).toFixed(1));
                        else 
                            reps_max[j][i] = 0;
                    }
                }
            }

            //create a duplicate of reps_max and replace the null by previous value: used to compute the average
            let duplicateFilledNull = JSON.parse(JSON.stringify(reps_max)); //create deep copy
            for (let i = 0; i < keys.length; i++) {
                for (let j = 1; j < days.length; j++) {
                    if (duplicateFilledNull[j][i] === null){
                        duplicateFilledNull[j][i] = duplicateFilledNull[j-1][i];
                    }
                }
            }

            //convert the matrix into a dictionnary with the percents and the date
            reps_max = reps_max.reduce((a, elem, index) => {
                let res = {};
                elem.forEach((f, ind) => { if (f !== null) res[keys[ind]] = f; });
                if (Object.keys(res).length > 0) {
                    res["date"] = days[index];
                    a.push(res);
                }
                return a;
            }, []);
            //convert the matrix into a dictionnary with the percents and the date
            duplicateFilledNull = duplicateFilledNull.reduce((a, elem, index) => {
                let res = {};
                elem.forEach((f, ind) => { if (f !== null) res[keys[ind]] = f; });
                if (Object.keys(res).length > 0) {
                    res["date"] = days[index];
                    a.push(res);
                }
                return a;
            }, []);

            //add the average value
            reps_max.forEach((d, index) => {
                let c = 0;
                let sum = Object.values(duplicateFilledNull[index]).reduce((a, e, ind) => { 
                            if (Object.keys(duplicateFilledNull[index])[ind] !== "date") { 
                                a += e; 
                                c += 1; 
                            } 
                            return a; 
                        }, 0);
                if(c === 0)  reps_max[index]["average"] = 0;
                else reps_max[index]["average"] = parseFloat((sum / c).toFixed(1));
                    
            });

            
        }
    }


    return (<Grid item xs={12} sx={{ padding: "0" }}>
        {workoutHistory !== null && workoutHistory !== {}
            ?
            <Grid item xs={12}>
                <TabContext value={exercise.toString()}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={exercise} variant="fullWidth" onChange={handleChange} aria-label="label tabs example">
                            <Tab sx={{ padding: "0.2em", fontSize: "0.9em", textTransform: "none" }} label={"General"} value={"-1"} />
                            {Object.entries(workoutHistory).map((e, index) => { return <Tab key={index} sx={{ padding: "0.2em", fontSize: "0.9em", textTransform: "none" }} label={e[0]} value={e[0]} /> })}
                        </Tabs>
                    </Box>
                    <TabPanel value={"-1"} sx={{ padding: "0em" }}>
                        <TimeChart
                            data={reps_max}
                            num_set={"all_exercises"}
                            plots={Object.keys(workoutHistory).concat(["average"])}

                            openDialog={openDialog}
                            dialogData={dialogData}
                            handleCloseDialogACB={handleCloseDialogACB}
                            handleActionDialogACB={handleActionDialogACB}
                            handleClickDateAxisACB={handleClickDateAxisACB}

                            selectedDate={selectedDate}

                            openMessageSnackBar={openMessageSnackBar}
                            messageInfoSnackBar={messageInfoSnackBar}
                            messageTypeSnackBar={messageTypeSnackBar}
                            handleCloseSnackBar={handleCloseSnackBar}
                            handleExitedSnackBarACB={handleExitedSnackBarACB}
                        />
                    </TabPanel>
                    {(workoutHistory[exercise] === undefined || Object.keys(workoutHistory[exercise]).length === 0)
                        ? <Box>
                            {exercise === "-1" ? <Box></Box> : <Box sx={{ padding: "2em 0", fontSize: "1em" }}>No data</Box>}
                        </Box>
                        :
                        <TabContext value={numSet.toString()}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={numSet} variant="fullWidth" onChange={handleChangeNumSet} aria-label="label tabs example">
                                    {[...Array(number_of_sets + 1).keys()].map((e, index) => {
                                        return <Tab key={index} sx={{ padding: "0.2em", fontSize: "0.9em", textTransform: "none" }} label={[...Array(number_of_sets + 1).keys()].map((f) => {
                                            if (f === e) {
                                                if (f === 0) {
                                                    return "All Sets"
                                                }
                                                else {
                                                    return "Set " + e
                                                }
                                            }
                                            else return null
                                        })} value={e} />
                                    })}
                                </Tabs>
                            </Box>
                        </TabContext>
                    }

                    {(workoutHistory[exercise] === undefined || Object.keys(workoutHistory[exercise]).length === 0)
                        ?
                        <Box></Box>
                        :
                        <TabPanel value={exercise}>
                            {numSet === 0
                                ?
                                <TimeChart
                                    data={days.reduce((a, d) => { let to_push = Object.entries(workoutHistory[exercise]).find((e) => { return e[0] === d }); if (to_push) a.push(createDataCB(to_push)); return a; }, [])}
                                    num_set={"all"}
                                    plots={[]}

                                    openDialog={openDialog}
                                    dialogData={dialogData}
                                    handleCloseDialogACB={handleCloseDialogACB}
                                    handleActionDialogACB={handleActionDialogACB}
                                    handleClickDateAxisACB={handleClickDateAxisACB}

                                    selectedDate={selectedDate}

                                    openMessageSnackBar={openMessageSnackBar}
                                    messageInfoSnackBar={messageInfoSnackBar}
                                    messageTypeSnackBar={messageTypeSnackBar}
                                    handleCloseSnackBar={handleCloseSnackBar}
                                    handleExitedSnackBarACB={handleExitedSnackBarACB}
                                />
                                :
                                <TimeChart
                                    data={Object.entries(workoutHistory[exercise]).sort((a, b) => {
                                        a = a[0].split('-').reverse().join('');
                                        b = b[0].split('-').reverse().join('');
                                        return a > b ? 1 : a < b ? -1 : 0;
                                    }).reduce((a, e) => { a.push(createDataCB(e)); return a; }, [])}
                                    num_set={numSet}
                                    plots={[]}

                                    openDialog={openDialog}
                                    dialogData={dialogData}
                                    handleCloseDialogACB={handleCloseDialogACB}
                                    handleActionDialogACB={handleActionDialogACB}
                                    handleClickDateAxisACB={handleClickDateAxisACB}

                                    selectedDate={selectedDate}

                                    openMessageSnackBar={openMessageSnackBar}
                                    messageInfoSnackBar={messageInfoSnackBar}
                                    messageTypeSnackBar={messageTypeSnackBar}
                                    handleCloseSnackBar={handleCloseSnackBar}
                                    handleExitedSnackBarACB={handleExitedSnackBarACB}
                                />
                            }
                        </TabPanel>
                    }
                </TabContext>
            </Grid>
            :
            <Box></Box>
        }

    </Grid>


    );
}

export default WorkoutsHistoryDetailsView;
