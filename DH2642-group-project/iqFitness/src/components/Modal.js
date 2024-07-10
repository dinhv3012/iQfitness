import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    width: {
        xs: '80%', // 90% of screen width for xs screens
        sm: '75%', // 75% of screen width for sm screens
        md: '50%', // 50% of screen width for md screens
        lg: '40%', // 40% of screen width for lg screens
        xl: '30%', // 30% of screen width for xl screens
    },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const ModalComp = ({ show, setShow, title, info, children }) => {

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={show}
            onClose={() => setShow(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={show}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" align='center'>
                        {title}
                    </Typography>
                    <Typography sx={{ mt: 0.5 }} >
                        {info}
                    </Typography>
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}
export default ModalComp