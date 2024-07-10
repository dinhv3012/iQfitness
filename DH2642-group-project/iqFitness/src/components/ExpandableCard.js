import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function ExpandableCard(props) {
    const { name, type, muscle, difficulty, equipment, instructions } = props.item;
    const { cardIcon, onPressAdd } = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    //function that capitalizes the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Card >
            <CardHeader
                title={name}
                subheader={capitalizeFirstLetter(difficulty)}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {`Training style: ${capitalizeFirstLetter(type)}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`Muscle group: ${capitalizeFirstLetter(muscle)}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`Needed Equipment: ${capitalizeFirstLetter(equipment)}`}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to workout plan" onClick={() => onPressAdd(props.item)}>
                    {cardIcon}
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Instructions:</Typography>
                    <Typography paragraph>
                        {instructions}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}