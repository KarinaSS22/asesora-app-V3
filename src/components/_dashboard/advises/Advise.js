import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { WS_PATH } from '../../../Configurations';
import startFill from '@iconify/icons-eva/star-fill';
import MockImgAvatar from '../../../utils/mockImages';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import { sentenceCase } from 'change-case';
import { Typography, Box, Stack, Button, Grid, Avatar, Snackbar, Alert, Chip, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Label from '../../../components/Label';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import Cookies from 'universal-cookie';

const ChipStyled = styled(Chip)(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: '#EBF8F6'
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function dateFormat(date) {
    var dateTimeArray = date.split('T');
    var dateArray = dateTimeArray[0].split('-');
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

function timeFormat(dateStart, dateEnd) {
    var dateTimeStartArray = dateStart.split('T');
    var dateTimeEndArray = dateEnd.split('T');
    var timeStartArray = dateTimeStartArray[1].split(':');
    var timeEndArray = dateTimeEndArray[1].split(':');
    return `${timeStartArray[0]}:${timeStartArray[1]} - ${timeEndArray[0]}:${timeEndArray[1]}`;
}

function changeLabelModality(text) {
    if (text === 'P') {
        return sentenceCase('presencial');
    }
    else {
        return sentenceCase('virtual');
    }
}

function Advise(props) {
    const [showAlert, setShowAlert] = useState({ message: '', show: false, duration: 0, severity: '' });
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [advises, setAdvises] = useState({ advise_code: '' });
    const cookies = new Cookies();

    const peticionesGet = async () => {
        await axios.get(`${WS_PATH}advises/${props.id}`)
            .then(Response => {
                setAdvises(Response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        peticionesGet();
    });

    var gapi = window.gapi;
    var CLIENT_ID = '403325894307-riktnlopiv84g0mjisqa6b9rgclkeigo.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyAN18U9TJjC3nVndaQM6ovngAAnJvOvgZU';
    var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
    var SCOPES = 'https://www.googleapis.com/auth/calendar';
    var event = {};

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setShowAlert({ message: '', show: false, duration: 0, severity: '' });
    }

    const peticionPut = () => {
        axios.put(`${WS_PATH}advises/${props.id}`, {
            advise_code: advises.advise_code,
            advise_student: props.idStudent,
            advise_topic: advises.advise_topic,
            advise_subject: advises.advise_subject,
            advise_advisor: advises.advise_advisor,
            advise_school: advises.advise_school,
            advise_building: advises.advise_building,
            advise_classroom: advises.advise_classroom,
            advise_date_request: advises.advise_date_request,
            advise_date_start: advises.advise_date_start,
            advise_date_ends: advises.advise_date_ends,
            advise_modality: advises.advise_modality,
            advise_url: advises.advise_url,
            advise_comments: advises.advise_comments,
            advise_status: 'A',
        })
            .then((response) => {
                setShowAlert({
                    message: '¡Se agendó la asesoría con éxito!, puedes consultarla en tu calendario',
                    show: true,
                    duration: 6000,
                    severity: 'success'
                });
                setOpen(true);
                setLoading(false);
                setDisabled(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const googleCalendar = () => {
        setOpenDialog(false);

        gapi.load('client:auth2', () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'));

            gapi.auth2.getAuthInstance().signIn()
                .then(() => {
                    if (props.modality === 'P') {
                        event = {
                            'summary': 'AsesoraApp',
                            'location': `ITCJ- Edificio: ${advises.building_name} - ${advises.classroom_name}`,
                            'description': `Cita para tomar asesoría de ${props.subject}`,
                            'colorId': 2,
                            'start': {
                                'dateTime': props.start,
                                'timeZone': 'America/Chihuahua'
                            },
                            'end': {
                                'dateTime': props.end,
                                'timeZone': 'America/Chihuahua'
                            },
                            'reminders': {
                                'useDefault': false,
                                'overrides': [
                                    { 'method': 'popup', 'minutes': 3 * 60 },
                                ],
                            }
                        }
                    } else {
                        event = {
                            'summary': 'AsesoraApp',
                            'location': 'Reunión en Meet',
                            'description': `Cita para tomar asesoría de ${props.subject}`,
                            'colorId': 2,
                            'start': {
                                'dateTime': props.start,
                                'timeZone': 'America/Chihuahua'
                            },
                            'end': {
                                'dateTime': props.end,
                                'timeZone': 'America/Chihuahua'
                            },
                            'reminders': {
                                'useDefault': false,
                                'overrides': [
                                    { 'method': 'popup', 'minutes': 15 },
                                ],
                            },
                            "conferenceData": {
                                "entryPoints": [
                                    {
                                        "entryPointType": 'video',
                                        "uri": `https://meet.google.com/${advises.advise_url}`,
                                        "label": `Reunión ${props.subject}`,
                                        "meetingCode": advises.advise_url,
                                    }
                                ],
                                "conferenceSolution": {
                                    "key": {
                                        "type": 'hangoutsMeet'
                                    }
                                },
                            },

                        }
                    }

                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                        'conferenceDataVersion': 1
                    })

                    request.execute(event => {
                        if (event.id) {
                            window.open(event.htmlLink);
                            peticionPut();
                        } else {
                            setShowAlert({
                                message: 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde',
                                show: true,
                                duration: 6000,
                                severity: 'error'
                            });
                            setOpen(true);
                            setLoading(false);
                        }
                    })
                })
        });
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setShowAlert({ message: '', show: false, duration: 0 });
        setOpen(false);
        setLoading(false);
        setDisabled(false);
    }

    const handleClick = () => {
        setLoading(true);
        setOpenDialog(true);
    }

    return (
        advises.advise_code === ''
        ?
            <Skeleton variant="rectangular" height={235} />
        :
            <Stack
                alignItems="center"
                spacing={0}
                sx={{ p: 2 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <Typography gutterBottom variant="h6" sx={{ m: 0, mr: 1 }}>
                        {props.subject}
                    </Typography>
                    <Label
                        variant="ghost"
                        color={(props.modality === 'V' && 'virtual') || 'default'}
                        style={{ alignSelf: 'flex-start', minWidth: 'auto' }}
                    >
                        {changeLabelModality(props.modality)}
                    </Label>
                </div>

                <Box sx={{ flex: 'flex', textAlign: 'left', mt: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        <ChipStyled label={`Fecha ${dateFormat(props.start)}`} sx={{ mb: 1, mr: 1 }} />
                        <ChipStyled label={`Horario ${timeFormat(props.start, props.end)}`} sx={{ mb: 1 }} />
                    </div>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <div style={{ display: 'inline-flex' }}>
                            <IconButton
                                to={`/dashboard/adviser-profile/${props.idAdviser}`}
                                component={RouterLink}
                                sx={{
                                    padding: 0,
                                    width: 35,
                                    height: 35
                                }}>
                                <Avatar
                                    src={`data:image/png;base64,${props.image !== '' ? props.image : MockImgAvatar()}`}
                                    alt={'subject.idAdvisor'}
                                />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 2 }}>
                                {props.adviser}
                            </Typography>
                        </div>
                        <div style={{ display: 'inline-flex' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                                {props.rating}&nbsp;
                                <Icon icon={startFill} />
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 1 }}>
                                {props.comments}&nbsp;
                                <Icon icon={messageCircleFill} />
                            </Typography>
                        </div>
                    </Box>
                </Box>
                {
                    cookies.get('UserType') === 'S'
                    ?
                        null
                    :
                        <Grid container columnSpacing={0} sx={{ mt: 2 }}>
                            <LoadingButton fullWidth onClick={handleClick} loading={loading} disabled={disabled}>
                                agendar asesoría
                            </LoadingButton>
                        </Grid>
                }
                <Dialog open={openDialog} TransitionComponent={Transition} onClose={handleCloseDialog}>
                    <DialogTitle>Registrar asesoría</DialogTitle>
                    <DialogContent>
                        Estas a punto de agregar esta asesoría a tu calendario ¿Deseas continuar?
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
                        <Button fullWidth variant="contained" onClick={googleCalendar}>aceptar</Button>
                        <Button fullWidth onClick={handleCloseDialog}>cancelar</Button>
                    </DialogActions>
                </Dialog>

                {
                    showAlert.show
                    ?
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={showAlert.duration} onClose={handleClose} sx={{ mt: 10 }}>
                            <Alert onClose={handleClose} severity={showAlert.severity} sx={{ width: '100%', boxShadow: 10 }}>
                                {showAlert.message}
                            </Alert>
                        </Snackbar>
                    :
                        null
                }
            </Stack>
    );
}
export default Advise;