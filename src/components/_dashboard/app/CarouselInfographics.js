import * as React from 'react';
import { Icon } from '@iconify/react';
import { Card, IconButton, MobileStepper, Box, useTheme } from '@mui/material';
import arrowLeft from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowRight from '@iconify/icons-eva/arrow-ios-forward-fill';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Cookies from 'universal-cookie';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function uploadImages(type) {
    if (type === 'N') {
        return (
            [
                {
                    label: 'Lista de asesorías_sistemas',
                    imgPath: 'http://cdjuarez.tecnm.mx/img/img_slider/Asesorias_sistemas_20405.jpg',
                    link: 'https://drive.google.com/file/d/1HxELBt40ZFUnCMNMv7jHo9sMsw8w-Q_y/view'
                },
                {
                    label: 'Lista de asesorías_feb-Jun2022',
                    imgPath: 'http://cdjuarez.tecnm.mx/img/img_slider/asesorias_ciencias0307.jpg',
                    link: 'https://drive.google.com/file/d/1j94Cl2ho0UPr-sRs24E6UUbbmJCFdeis/view'
                },
                {
                    label: 'Videos de tutoriales - temas selectos',
                    imgPath: 'http://www.itcj.edu.mx/img/img_slider/TUTORIALESPROFRAZTLAN1011.jpg',
                    link: 'https://www.youtube.com/channel/UCDooQkReQ_eXZwzoNmj0hbg/videos'
                },
                {
                    label: 'Buzón de ITCJ',
                    imgPath: 'http://cdjuarez.tecnm.mx/img/img_slider/buzon760906.jpg',
                    link: 'http://cdjuarez.tecnm.mx/buzontec/'
                },
            ]
        );
    } else {
        return (
            [
                {
                    label: 'Libre de plásticos',
                    imgPath: 'http://www.itcj.edu.mx/img/img_slider/LIBREDEPLaSTICO201910819.jpg',
                    link: 'https://www.youtube.com/watch?v=BrS8zSJqVaE'
                },
                {
                    label: 'Igualdad de género',
                    imgPath: 'http://cdjuarez.tecnm.mx/img/img_slider/Igualdad_de_genero0125.jpg',
                },
                {
                    label: 'Cuidemos el agua',
                    imgPath: 'http://cdjuarez.tecnm.mx/img/img_slider/agua11201.jpg',
                },
                {
                    label: 'Política integral',
                    imgPath: 'http://www.itcj.edu.mx/img/img_slider/POLITICADECALIDAD201910603.jpg',
                }
            ]
        );
    }
}

function CarouselInfographics() {
    const cookies = new Cookies();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = uploadImages(cookies.get('UserType')).length;

    const handleNext = () => {
        if (activeStep === maxSteps - 1) {
            setActiveStep(0);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep === 0) {
            setActiveStep(maxSteps - 1);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Card sx={{ height: '420px' }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {uploadImages(cookies.get('UserType')).map((step, index) => (
                    <div key={step.label}>
                        {
                            Math.abs(activeStep - index) <= 2
                            ?
                                (
                                    <a href={step.link}>
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 370,
                                                display: 'block',
                                                overflow: 'hidden',
                                                width: '100%'
                                            }}
                                            src={step.imgPath}
                                            alt={step.label}
                                        />
                                    </a>
                                )
                            :
                                null
                        }
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <IconButton color="primary" size="small" onClick={handleNext}>
                        <Icon icon={arrowRight} width="26px" />
                    </IconButton>
                }
                backButton={
                    <IconButton color="primary" size="small" onClick={handleBack}>
                        <Icon icon={arrowLeft} width="26px" />
                    </IconButton>
                }
                sx={{borderRadius: '0'}}
            />
        </Card>
    );
}

export default CarouselInfographics;