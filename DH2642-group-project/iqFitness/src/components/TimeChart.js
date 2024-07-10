import React from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";

import { Grid, Box, Snackbar, IconButton, Typography, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';


import { Digit1, Digit2, Digit3, Digit4, Digit5, Digit6, Digit7, Digit8, Digit9, Digit10, DigitPlus } from "./DigitsSVG";

export default function TimeChart({
  data,
  num_set,
  plots,
  openDialog,
  dialogData,
  handleCloseDialogACB,
  handleActionDialogACB,
  handleClickDateAxisACB,
  openMessageSnackBar,
  messageInfoSnackBar,
  messageTypeSnackBar,
  handleCloseSnackBar,
  handleExitedSnackBarACB,

}) {



  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  const colors = ["red", "gold", "green", "blue"];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  if (num_set === "all_exercises") {

    return <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ textAlign: "center", fontFamily: "inherit", color: "black", margin: "0.5em 0 0em" }}>Evolution of performances</Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginBottom: "1em" }}>
        <Typography variant="body2" sx={{ textAlign: "center", fontFamily: "inherit", color: "black", margin: "0em" }}>Computed from 1 rep max equivalence</Typography>
      </Grid>

      {data.length > 0
        ?
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}
            margin={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" padding={{ left: 20, right: 20 }} onClick={handleClickDateAxisACB} />
            <YAxis unit="%" type="number" allowDecimals={false} padding={{ top: 20, bottom: 20 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            {plots.map((e, index) => {
              if (e === "average") return <Line key={index} connectNulls type="monotone" name={capitalizeFirstLetter(e)} dataKey={e} stroke={"black"} strokeWidth={2.5} dot={true} />
              else return <Line key={index} connectNulls type="monotone" name={capitalizeFirstLetter(e)} dataKey={e} stroke={colors[index]} dot={true} />
            })
            }

          </ComposedChart>
        </ResponsiveContainer>
        :
        <Box>No data</Box>
      }

      <Dialog
        open={openDialog}
        onClose={handleCloseDialogACB}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogData.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogData.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionDialogACB}>{dialogData.button1}</Button>
          <Button onClick={handleActionDialogACB}>
            {dialogData.button2}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key={messageInfoSnackBar ? messageInfoSnackBar.key : undefined}
        open={openMessageSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        TransitionProps={{ onExited: handleExitedSnackBarACB }}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleCloseSnackBar} severity={messageTypeSnackBar} sx={{ width: '100%' }}>
          {messageInfoSnackBar ? messageInfoSnackBar.message : undefined}
        </Alert>
      </Snackbar>
    </Grid>;

  }
  else {

    //Create the sets and sets_all arrays with the good format from the data prop
    let sets = [];
    let sets_all = {};

    let test = 0;
    let num = 1;
    while (test < 100) {
      test += 1;
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i]["set " + num] !== undefined) {
          let str = data[i]["set " + num][1] + " reps";
          res.push({ "date": data[i]["date"], "weight": data[i]["set " + num][0], "reps": data[i]["set " + num][1] });
          res.at(-1)[str] = res.at(-1)["weight"];

          if (!Object.keys(sets_all).includes(data[i]["date"])) {
            sets_all[data[i]["date"]] = { "date": data[i]["date"] };
          }

          sets_all[data[i]["date"]]["set " + num] = res.at(-1)["weight"];
          sets_all[data[i]["date"]]["set " + num + " - " + data[i]["set " + num][1] + " reps"] = res.at(-1)["weight"];

        }
      }
      if (res.length > 0) {
        sets.push(res);
      }
      else {
        break;
      }
      num += 1;
    }


    const sets_list = [...Array(sets.length).keys()].reduce((a, e) => { a.push("set " + (e + 1)); return a; }, []);   //  = ["set 1","set 2", "set 3", "set 4", ...];

    const global_max_rep = Math.max(...sets.reduce((a,e)=>{e.forEach((f)=>{a.push(f.reps)}); return a;}, []));
    
    let reps_liste = {
      "1 reps": <Digit1 shape_size={20} />,
      "2 reps": <Digit2 shape_size={20} />,
      "3 reps": <Digit3 shape_size={20} />,
      "4 reps": <Digit4 shape_size={20} />,
      "5 reps": <Digit5 shape_size={20} />,
      "6 reps": <Digit6 shape_size={20} />,
      "7 reps": <Digit7 shape_size={20} />,
      "8 reps": <Digit8 shape_size={20} />,
      "9 reps": <Digit9 shape_size={20} />,
      "10 reps": <Digit10 shape_size={20} />,
    };

    for(var i=11; i<global_max_rep+1; i++){
      reps_liste[i+" reps"] = <DigitPlus shape_size={20} />;
    }


    return <Box>
      {(num_set !== "all" && num_set !== "all_exercises" && (sets[num_set - 1] === undefined || Object.keys(sets[num_set - 1]).length === 0))
        ?
        <Box sx={{ padding: "2em 0", fontSize: "1em" }}>No data</Box>
        :
        <Box></Box>}
      <ResponsiveContainer width="100%" height={400}>
        {num_set === "all"
          ?
          <ComposedChart data={Object.values(sets_all)}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" padding={{ left: 20, right: 20 }} onClick={handleClickDateAxisACB} />
            <YAxis unit="kg" type="number" allowDecimals={false} padding={{ top: 20, bottom: 20 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            {sets_list.map((e, index) => {
              return <Line key={index} connectNulls type="monotone" name={capitalizeFirstLetter(e)} dataKey={e} stroke={colors[index]} dot={false} />
            })}
            {sets_list.map((s, index) => {
              return Object.entries(reps_liste).map((e) => {
                return <Scatter
                  dataKey={s + " - " + e[0]}
                  shape={e[1]}
                  tooltipType="none"
                  legendType="none"
                />
              })
            })
            }

          </ComposedChart>

          :
          <ComposedChart data={sets[num_set - 1]}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" padding={{ left: 20, right: 20 }} onClick={handleClickDateAxisACB} />
            <YAxis unit="kg" type="number" allowDecimals={false} padding={{ top: 20, bottom: 20 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" key={0} connectNulls data={sets[num_set - 1]} name={"Set " + num_set} dataKey="weight" stroke={colors[num_set - 1]} dot={false} />
            <Legend />
            {Object.entries(reps_liste).map((e, index) => {
              return <Scatter
                dataKey={e[0]}
                shape={e[1]}
                legendType="none"
                tooltipType="none"
              />
            })}

          </ComposedChart>
        }
      </ResponsiveContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialogACB}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogData.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogData.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionDialogACB}>{dialogData.button1}</Button>
          <Button onClick={handleActionDialogACB}>
            {dialogData.button2}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key={messageInfoSnackBar ? messageInfoSnackBar.key : undefined}
        open={openMessageSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        TransitionProps={{ onExited: handleExitedSnackBarACB }}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleCloseSnackBar} severity={messageTypeSnackBar} sx={{ width: '100%' }}>
          {messageInfoSnackBar ? messageInfoSnackBar.message : undefined}
        </Alert>
      </Snackbar>
    </Box >;
  }
}
