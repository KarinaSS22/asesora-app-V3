import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import styled from '@emotion/styled';
import { Card, Stack, Avatar, Container, Typography, TextField, Switch, Snackbar, Alert, Autocomplete } from '@mui/material';
import Page from '../components/Page';
import { LoadingButton } from '@mui/lab';
import Label from '../components/Label';
import { useFormik, Form, FormikProvider } from 'formik';
import Scrollbar from '../components/Scrollbar';
import MockImgAvatar from '../utils/mockImages';
import { WS_PATH, NAME_APP } from '../Configurations';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { es } from 'date-fns/locale';
import Cookies from 'universal-cookie';
import axios from 'axios';

const ContainerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

function changeLabelModality(bool) {
  if (bool) {
    return sentenceCase('virtual');
  } else {
    return sentenceCase('presencial');
  }
}

function dateTimeFormat(date, time) {
  const month = `0${date.getMonth() + 1}`.slice(-2).toString();
  const day = `0${date.getDate()}`.slice(-2).toString();
  const hours = `0${time.getHours()}`.slice(-2).toString();
  const minutes = `0${time.getMinutes()}`.slice(-2).toString();
  return (`${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:00`);
}

function NewAdvises() {
  const [modality, setModality] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlertPost, setShowAlertPost] = useState(false);
  const [open, setOpen] = useState(false);
  const [dateAdvise, setDateAdvise] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dateEndMin, setDateEndMin] = useState(null);
  const [infoUser, setInfoUser] = useState({ userx_code: '', userx_name: '', userx_lastname: '', userx_mother_lastname: '' });
  const [subject, setSubject] = useState([]);
  const [building, setBuilding] = useState([]);
  const [classroom, setClassroom] = useState([]);
  const [valueSubject, setValueSubject] = useState('');
  const [valueBuilding, setValueBuilding] = useState('');
  const [valueClassroom, setValueClassroom] = useState('');
  const [listClassroom, setListClassroom] = useState([]);
  const [valueLinkMeet, setValueLinkMeet] = useState('');

  const cookies = new Cookies();
  const navigate = useNavigate();
  const date = new Date();

  const getUserRequest = async () => {
    await axios.get(`${WS_PATH}users/${cookies.get('UserCode')}`)
      .then(response => {
        setInfoUser(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const getSubjectRequest = async () => {
    await axios.get(`${WS_PATH}subjects`)
      .then(response => {
        setSubject(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const getBuildingRequest = async () => {
    await axios.get(`${WS_PATH}buildings`)
      .then(response => {
        setBuilding(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const getClassroomRequest = async () => {
    await axios.get(`${WS_PATH}classrooms`)
      .then(response => {
        setClassroom(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getSubjectRequest();
    getBuildingRequest();
    getClassroomRequest();
  }, []);

  useEffect(() => {
    if (!cookies.get('UserCode')) {
      navigate('/');
    }
    getUserRequest();
  });

  const validateDuration = (minutes) => {
    var ms = 60000 * minutes;
    var start = new Date(dateStart);
    var end = new Date(dateEnd);
    var diffMs = (end - start);
    if (diffMs > ms) {
      return true;
    } else {
      return false;
    }
  };

  const validate = () => {
    const errors = {};
    if ((valueSubject === '') || (valueSubject === null)) {
      errors.subject = 'La materia es obligatoria';
    }
    if ((dateAdvise === '') || (dateAdvise === null)) {
      errors.dateAdvise = 'La fecha es obligatoria';
    }
    if ((dateStart === '') || (dateStart === null)) {
      errors.dateStart = 'La hora inicial es obligatoria';
    }
    if ((dateEnd === '') || (dateEnd === null)) {
      errors.dateEnd = 'La hora final es obligatoria';
    } else if (validateDuration(120)) {
      errors.dateEnd = 'La asesoría no puede durar más de dos horas';
    }

    if (modality) {
      if ((valueLinkMeet === '') || (valueLinkMeet === null)) {
        errors.linkMeet = 'El código de la reunión es obligatorio';
      } else if (!/^[a-z]{3}-{1}[a-z]{4}-{1}[a-z]{3}$/.test(valueLinkMeet)) {
        errors.linkMeet = 'Ingrese el código, por ejemplo: aaa-bbbb-ccc';
      }
    } else {
      if ((valueBuilding === '') || (valueBuilding === null)) {
        errors.building = 'El edificio es obligatorio';
      } else if ((valueClassroom === '') || (valueClassroom === null)) {
        errors.classroom = 'El salón es obligatorio';
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      school: 'Instituto Tecnológico de Ciudad Juárez',
      subject: '',
      dateAdvise: '',
      dateStart: '',
      dateEnd: '',
      building: '',
      classroom: '',
      linkMeet: ''
    },
    validate,
    onSubmit: () => {
      setLoading(true);
      postAdvise();
    },
  });

  const postAdvise = async () => {
    await axios.post(`${WS_PATH}advises`, {
      advise_student: 'l00000000',
      advise_topic: 'Pendiente',
      advise_subject: valueSubject.id,
      advise_advisor: cookies.get('UserCode'),
      advise_school: 'ITCJC1',
      advise_building: modality ? '000' : valueBuilding.id,
      advise_classroom: modality ? '000' : valueClassroom.id,
      advise_date_request: dateTimeFormat(dateAdvise, dateAdvise),
      advise_date_start: dateTimeFormat(dateAdvise, dateStart),
      advise_date_ends: dateTimeFormat(dateAdvise, dateEnd),
      advise_modality: modality ? 'V' : 'P',
      advise_url: modality ? valueLinkMeet : 'link',
      advise_comments: '',
      advise_status: 'S',
      advise_rating: 0
    })
      .then((response) => {
        setLoading(false);
        setShowAlertPost(true);
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const optionsSubject = () => {
    let data = [];
    subject.filter((element) => {
      data.push({ label: element.subjectx_name, id: element.subjectx_id });
      return 0;
    });

    var uniqueArray = [...new Set(data)];
    return uniqueArray;
  };

  const optionsBuilding = () => {
    let data = [];
    building.filter((element) => {
      if (element.building_code !== '000') {
        data.push({ label: element.building_name, id: element.building_code });
      }
      return 0;
    });

    var uniqueArray = [...new Set(data)];
    return uniqueArray;
  };

  const filterClassrooms = (value) => {
    let data = [];
    if (value !== null) {
      classroom.filter((element) => {
        if ((element.classroom_building === value.id) && (element.classroom_code !== '000')) {
          data.push({ label: element.classroom_name, id: element.classroom_code });
        }
        return 0;
      });
    }
    var uniqueArray = [...new Set(data)];
    setListClassroom(uniqueArray);
    setValueBuilding(value);
    setValueClassroom('');
  };

  const validateTimeEnds = (value, minutes) => {
    var time = new Date(value);
    time.setMinutes(time.getMinutes() + minutes);
    setDateEndMin(time);
    setDateStart(value);
  };

  const handleChange = (event) => {
    setValueLinkMeet(event.target.value);
  };

  const clearData = () => {
    setDateAdvise(null);
    setDateStart(null);
    setDateEnd(null);
    setValueSubject('');
    setValueBuilding('');
    setValueClassroom('');
    setListClassroom([]);
    setValueLinkMeet('');
  };

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Page title={`Asesora${NAME_APP} | Mis Asesorías`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Agregar Asesoría
          </Typography>
        </Stack>

        <ContainerStyle>
          <Card sx={theme => ({
            width: '32%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.down('md')]: {
              width: '100%',
              marginBottom: '24px'
            }
          })}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
              <Label
                variant="ghost"
                color={(modality === false && 'default') || 'virtual'}
              >
                {changeLabelModality(modality)}
              </Label>
            </div>

            <Avatar src={`data:image/png;base64,${MockImgAvatar()}`} sx={{ width: '106px', height: '106px', margin: 'auto' }} />

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                <Typography variant='subtitle2' sx={{ wordWrap: 'break-word' }}>
                  Modalidad
                </Typography>
                <Typography variant='body2' sx={{ wordWrap: 'break-word' }}>
                  Definir la modalidad de la asesoría
                </Typography>
              </div>
              <Switch sx={{ pl: 2 }} onChange={() => setModality(!modality)} checked={modality} />
            </div>

          </Card>

          <Card sx={theme => ({
            width: '66%',
            [theme.breakpoints.down('md')]: {
              width: '100%'
            }
          })}>
            <Scrollbar>
              <FormikProvider value={formik} sx={{ padding: '24px' }}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Stack spacing={2} sx={{ padding: '24px' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Clave"
                        value={infoUser.userx_code}
                        disabled
                      />

                      <TextField
                        fullWidth
                        label="Escuela"
                        disabled
                        {...getFieldProps('school')}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Asesor"
                        value={`${infoUser.userx_name} ${infoUser.userx_lastname} ${infoUser.userx_mother_lastname}`}
                        disabled
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id="combo-box-subject"
                        value={valueSubject}
                        onChange={(event, newValue) => {
                          setValueSubject(newValue);
                        }}
                        options={optionsSubject()}
                        noOptionsText={'No hay coincidencias'}
                        renderInput={
                          (params) =>
                            <TextField
                              {...params}
                              label="Materia"
                              error={Boolean(touched.subject && errors.subject)}
                              helperText={touched.subject && errors.subject} />
                        }
                      />

                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                        <DatePicker
                          value={dateAdvise}
                          minDate={date.setDate(date.getDate() + 1)}
                          onChange={(newValue) => {
                            setDateAdvise(newValue);
                          }}
                          renderInput={
                            (params) =>
                              <TextField
                                fullWidth
                                {...params}
                                label="Fecha de asesoría"
                                error={Boolean(touched.dateAdvise && errors.dateAdvise)}
                                helperText={touched.dateAdvise && errors.dateAdvise} />
                          }
                        />
                      </LocalizationProvider>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          value={dateStart}
                          onChange={(newValue) => {
                            validateTimeEnds(newValue, 20);
                          }}
                          renderInput={
                            (params) =>
                              <TextField
                                fullWidth
                                {...params}
                                label="Hora inicio"
                                error={Boolean(touched.dateStart && errors.dateStart)}
                                helperText={touched.dateStart && errors.dateStart} />
                          }
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          value={dateEnd}
                          minTime={dateEndMin}
                          onChange={(newValue) => {
                            setDateEnd(newValue);
                          }}
                          renderInput={
                            (params) =>
                              <TextField
                                fullWidth
                                {...params}
                                label="Hora fin"
                                error={Boolean(touched.dateEnd && errors.dateEnd)}
                                helperText={touched.dateEnd && errors.dateEnd} />
                          }
                        />
                      </LocalizationProvider>
                    </Stack>

                    {
                      modality
                      ?
                        <TextField
                          fullWidth
                          label="Código de reunión de Google Meet"
                          value={valueLinkMeet}
                          onChange={handleChange}
                          error={Boolean(touched.linkMeet && errors.linkMeet)}
                          helperText={touched.linkMeet && errors.linkMeet}
                        />
                      :
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-building"
                            value={valueBuilding}
                            onChange={(event, newValue) => {
                              filterClassrooms(newValue);
                            }}
                            options={optionsBuilding()}
                            noOptionsText={'No hay coincidencias'}
                            renderInput={
                              (params) =>
                                <TextField
                                  {...params}
                                  label="Edificio"
                                  error={Boolean(touched.building && errors.building)}
                                  helperText={touched.building && errors.building} />
                            }
                          />

                          <Autocomplete
                            fullWidth
                            disablePortal
                            disabled={((valueBuilding === '') || (valueBuilding === null)) ? true : false}
                            id="combo-box-classroom"
                            value={valueClassroom}
                            onChange={(event, newValue) => {
                              setValueClassroom(newValue);
                            }}
                            options={listClassroom}
                            noOptionsText={'No hay coincidencias'}
                            renderInput={
                              (params) =>
                                <TextField
                                  {...params}
                                  label="Salón"
                                  error={Boolean(touched.classroom && errors.classroom)}
                                  helperText={touched.classroom && errors.classroom} />
                            }
                          />
                        </Stack>
                    }

                    <Stack direction={{ xs: 'column', sm: 'row-reverse' }} style={{ display: 'flex', alignItems: 'flex-end' }} spacing={2}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={loading}
                        style={{ width: 'fit-content' }}
                      >
                        Guardar cambios
                      </LoadingButton>

                      <LoadingButton
                        variant="outlined"
                        onClick={clearData}
                        style={{ width: 'fit-content' }}
                      >
                        Limpiar datos
                      </LoadingButton>

                      {
                        showAlertPost
                        ?
                          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', boxShadow: 10, marginTop: 10 }}>
                              Se ha registrado con éxito
                            </Alert>
                          </Snackbar>
                        :
                          null
                      }
                    </Stack>
                  </Stack>
                </Form>
              </FormikProvider>
            </Scrollbar>
          </Card>
        </ContainerStyle>
      </Container>
    </Page>
  );
}

export default NewAdvises;