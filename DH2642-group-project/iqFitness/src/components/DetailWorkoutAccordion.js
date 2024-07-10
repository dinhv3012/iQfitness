import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ReadMore from "./ReadMore";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function DetailWorkoutAccordion(props) {

    const { listData } = props;

    // smaller accordion, juste to display some general informations
    // listData = {["name":"name1", "value":"value1"],["name":"name2", "value":"value2"]}

    const [expanded, setExpanded] = useState(undefined);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            {listData.exercises.map((item, index) => {
                return (
                    <Accordion key={index} expanded={expanded === item.name} onChange={handleChange(item.name)}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography variant='subtitle1'>{item.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <li style={{ padding: "0.1em 0", margin: "0 1em" }}>{"Muscle"} : {item.muscle}</li>
                                <li style={{ padding: "0.1em 0", margin: "0 1em" }}>{"Difficulty"} : {item.difficulty}</li>
                                <li style={{ padding: "0.1em 0", margin: "0 1em" }}>{"Type"} : {item.type}</li>
                                <li style={{ padding: "0.1em 0", margin: "0 1em" }}>{"Equipment"} : {item.equipment}</li>
                                <li style={{ padding: "0.1em 0", margin: "0 1em" }}><span style={{ textDecoration: "underline" }}>Instructions</span> : <ReadMore>{item.instructions}</ReadMore></li>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
    );
}