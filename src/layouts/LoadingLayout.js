import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
 
const Modal = styled('div')(() => ({
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 100000,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
}));

const ModalContainer = styled('div')(() => ({
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center'
}));

const Loader = styled('div')(({ theme }) => ({
    width: 'fit-content',
    minWidth: '315px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 1,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: theme.shadows[20]
}));

function LoadingLayout(props) {
    const [toLonger, setToLonger] = useState(false);
    const [num, setNum] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setNum(num => num + 1);
            if (num > 6) {
                setToLonger(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [num]);

    return(
        <Modal>
            <ModalContainer>
                <Loader>
                    <PulseLoader size={25} margin="12px" color="#00A389" loading={props.isProcesing} />
                    {
                        props.isProcesing
                        ?
                            <>
                                {
                                    toLonger
                                    ?
                                        <Typography variant="h6" sx={{ mt: 1 }}>
                                            Esta tardando más de lo esperado
                                        </Typography>
                                    :
                                        <Typography variant="h6" sx={{ mt: 1 }}>
                                            Cargando
                                        </Typography>
                                }
                            </>
                        :
                            ''
                    }
                    
                </Loader>
            </ModalContainer>
        </Modal>
    );
}

export default LoadingLayout;