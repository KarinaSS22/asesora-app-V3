import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Stack, Container, Typography, Card, CardContent, Button, DialogActions, Dialog,
    DialogTitle, DialogContent, TextField, CircularProgress } from '@mui/material';
import Page from '../components/Page';
import Label from '../components/Label';
import esLocale from '@fullcalendar/core/locales/es';
import { sentenceCase } from 'change-case';
import { WS_PATH, NAME_APP } from '../Configurations';
import Slide from '@mui/material/Slide';
import Cookies from 'universal-cookie';
import axios from 'axios';

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

function Calendar() {
    const [data, setData] = useState([]);
    const [selectedAdvise, setSelectedAdvise] = useState({ advise_code: '' });
    const [open, setOpen] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const requestGet = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        requestGet();
    }, []);

    const date = new Date();
    const validate = (adviseDateTime, status) => {
        var adviseDateArray = adviseDateTime.split('T');
        var adviseDate = adviseDateArray[0].split('-');
        var todayD = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        var adviseD = new Date(adviseDate[0], adviseDate[1], adviseDate[2]);
        if ((todayD >= adviseD) || (status === 'C')) {
            return true;
        } else {
            return false;
        }
    };

    const filterData = () => {
        var filterResults = data.filter((element) => {
            var todayD = new Date();
            var todayA = new Date(element.advise_date_ends);
            if (cookies.get('UserType') === 'N') {
                if (element.advise_student === cookies.get('UserCode') && (element.advise_status !== 'S')) {
                    if (element.advisorStatus === 'A') {
                        return element;
                    } else if (todayA < todayD) {
                        return element;
                    }
                }
            } else if (cookies.get('UserType') === 'A') {
                if (element.advise_advisor === cookies.get('UserCode')) {
                    if (element.studentStatus === 'A') {
                        return element;
                    } else if (todayA < todayD) {
                        return element;
                    }
                }
            }
            return filterResults;
        });
        return filterResults;
    };

    const selectBackgroundColor = (status, modality) => {
        if (status === 'S') {
            return ('#FFF5D7');
        } else if (status === 'C') {
            return ('#fcd9d9');
        } else if (modality === 'P') {
            return ('#EDEFF1');
        } else if (modality === 'V') {
            return ('#E8E1FF');
        }
    };

    const selectBorderColor = (status, modality, dateEnd) => {
        var todayD = new Date();
        var todayA = new Date(dateEnd);
        if (todayA > todayD) {
            if (status === 'S') {
                return ('#FCBA6A');
            } else if (status === 'C') {
                return ('#E74C3C');
            } else if (modality === 'P') {
                return ('#647482');
            } else if (modality === 'V') {
                return ('#502FBC');
            }
        } else {
            return selectBackgroundColor(status, modality);
        }
    };

    const adviseList = filterData().map((element => ({
        id: element.advise_code,
        title: element.subjectx_name,
        start: element.advise_date_start,
        end: element.advise_date_ends,
        backgroundColor: selectBackgroundColor(element.advise_status, element.advise_modality),
        borderColor: selectBorderColor(element.advise_status, element.advise_modality, element.advise_date_ends),
        textColor: element.advise_modality === 'P' ? '#637381' : '#4B29BA'
    })));

    const handleEventClick = (info) => {
        axios.get(`${WS_PATH}advises/${info.event.id}`)
            .then(response => {
                setSelectedAdvise(response.data);
            }).catch(error => {
                console.log(error);
            });
        setOpen(true);
    }

    const handleClose = () => {
        setSelectedAdvise({ advise_code: '' });
        setOpen(false);
    }

    const handleCloseCancel = () => {
        setOpenCancel(false);
    }

    const cancelAdvise = () => {
        axios.put(`${WS_PATH}advises/${selectedAdvise.advise_code}`, {
            advise_code: selectedAdvise.advise_code,
            advise_student: cookies.get('UserType') === 'N' ? 'l00000000' : selectedAdvise.advise_student,
            advise_topic: selectedAdvise.advise_topic,
            advise_subject: selectedAdvise.advise_subject,
            advise_advisor: selectedAdvise.advise_advisor,
            advise_school: selectedAdvise.advise_school,
            advise_building: selectedAdvise.advise_building,
            advise_classroom: selectedAdvise.advise_classroom,
            advise_date_request: selectedAdvise.advise_date_request,
            advise_date_start: selectedAdvise.advise_date_start,
            advise_date_ends: selectedAdvise.advise_date_ends,
            advise_modality: selectedAdvise.advise_modality,
            advise_url: selectedAdvise.advise_url,
            advise_comments: selectedAdvise.advise_comments,
            advise_status: cookies.get('UserType') === 'N' ? 'S' : 'C'
        })
            .then((response) => {
                setOpen(false);
                setOpenCancel(false);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Page title={`Asesora${NAME_APP} | Calendario`}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Calendario
                    </Typography>
                </Stack>

                <Card>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <FullCalendar
                            height={'auto'}
                            width={'auto'}
                            plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
                            initialView="dayGridMonth"
                            weekends={true}
                            events={adviseList}
                            eventDisplay={'block'}
                            headerToolbar={{
                                right: 'today prev,next',
                                center: 'title',
                                left: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            nowIndicator={true}
                            locale={esLocale}
                            dayMaxEventRows={4}
                            eventClick={(e) => handleEventClick(e)}
                        />
                    </CardContent>
                </Card>
            </Container>
            <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} fullWidth={true}
                maxWidth={'xs'}>
                <DialogTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography gutterBottom variant="h7" sx={{ m: 0, mr: 1 }}>
                            Información de asesoría
                        </Typography>
                        <Label
                            variant="ghost"
                            color={selectedAdvise.advise_status === 'C' ? 'error' : (selectedAdvise.advise_modality === 'P' ? 'default' : 'virtual')}
                            style={{ alignSelf: 'flex-end', minWidth: 'auto' }}
                        >
                            {
                                selectedAdvise.advise_status === 'C'
                                ?
                                    <del> {changeLabelModality(selectedAdvise.advise_modality)} </del>
                                :
                                    changeLabelModality(selectedAdvise.advise_modality)
                            }
                        </Label>
                    </div>
                </DialogTitle>
                <DialogContent>
                    {
                        selectedAdvise.advise_code === ''
                        ?
                            <CircularProgress color="success" />
                        :
                            <Stack spacing={2} sx={{ padding: '12px' }}>

                                <TextField
                                    fullWidth
                                    label="Materia"
                                    value={selectedAdvise.subjectx_name}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Tema"
                                    value={selectedAdvise.advise_topic}
                                    disabled
                                />
                                {
                                    cookies.get('UserType') === 'N'
                                    ?
                                        <TextField
                                            fullWidth
                                            label="Asesor"
                                            value={`${selectedAdvise.advisorName} ${selectedAdvise.advisorLastName} ${selectedAdvise.advisorLastMotherName}`}
                                            disabled
                                        />
                                    :
                                        <TextField
                                            fullWidth
                                            label="Alumno"
                                            value={`${selectedAdvise.studentName} ${selectedAdvise.studentLastName} ${selectedAdvise.studentLastMotherName}`}
                                            disabled
                                        />
                                }

                                <TextField
                                    fullWidth
                                    label="Fecha"
                                    value={dateFormat(selectedAdvise.advise_date_start)}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Hora"
                                    value={timeFormat(selectedAdvise.advise_date_start, selectedAdvise.advise_date_ends)}
                                    disabled
                                />

                                <TextField
                                    fullWidth
                                    label="Lugar"
                                    value={
                                        selectedAdvise.advise_modality === 'V'
                                        ?
                                            selectedAdvise.advise_url
                                        :
                                            `Edificio: ${selectedAdvise.building_name} - ${selectedAdvise.classroom_name}`
                                    }
                                    disabled
                                />

                            </Stack>
                    }
                </DialogContent>

                <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
                    {
                        selectedAdvise.advise_code === ''
                        ?
                            null
                        :
                            <>
                                <Button fullWidth disabled={validate(selectedAdvise.advise_date_start, selectedAdvise.advise_status)} onClick={() => setOpenCancel(true)}>Cancelar</Button>
                                <Button fullWidth variant="contained" onClick={handleClose}>Cerrar</Button>
                            </>
                    }
                </DialogActions>
            </Dialog>

            <Dialog open={openCancel} TransitionComponent={Transition} onClose={handleCloseCancel}>
                <DialogTitle>Cancelar asesoría</DialogTitle>
                <DialogContent>
                    ¿Estas seguro de querer cancelar la asesoría?
                </DialogContent>
                <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
                    <Button fullWidth onClick={cancelAdvise}>Sí</Button>
                    <Button fullWidth variant="contained" onClick={handleCloseCancel}>No</Button>
                </DialogActions>
            </Dialog>
        </Page >
    );
}
export default Calendar;