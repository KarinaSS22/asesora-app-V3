import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { sentenceCase } from 'change-case';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { Card, Stack, Avatar, Container, Typography, TextField, Switch, Snackbar, Alert } from '@mui/material';
import Page from '../components/Page';
import { LoadingButton } from '@mui/lab';
import Label from '../components/Label';
import { useFormik, Form, FormikProvider } from 'formik';
import Scrollbar from '../components/Scrollbar';
import MockImgAvatar from '../utils/mockImages';
import { WS_PATH, NAME_APP } from '../Configurations';
import CryptoJS from 'crypto-js';
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

function changeLabelStatus(bool) {
  if (bool) {
    return sentenceCase('activo');
  } else {
    return sentenceCase('inactivo');
  }
}

function NewUser() {
  const [admin, setAdmin] = useState(false);
  const [advisor, setAdvisor] = useState(false);
  const [accountStatus, setStatus] = useState(true);
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState({ message: '', show: false });
  const [showAlertPost, setShowAlertPost] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const cookies = new Cookies();
  const navigate = useNavigate();
  const date = new Date();

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}users`)
      .then((Response) => {
        setData(Response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    peticionesGet();
  }, []);

  useEffect(() => {
    if (!cookies.get('UserCode')) {
      navigate('/');
    }
  });

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'El nombre es muy corto')
      .max(30, 'El nombre es muy largo')
      .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, "Ingrese solamente letras")
      .required('El nombre es obligatorio'),
    lastName: Yup.string()
      .min(2, 'El apellido es muy corto')
      .max(30, 'El apellido es muy largo')
      .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, "Ingrese solamente letras, sin dejar espacios")
      .required('El apellido es obligatorio'),
    motherLastName: Yup.string()
      .min(2, 'El apellido es muy corto')
      .max(30, 'El apellido es muy largo')
      .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, "Ingrese solamente letras, sin dejar espacios"),
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(8, "La contraseña debe contener mínimo 8 caracteres"),
    phone: Yup.string()
      .min(2, 'El teléfono es muy corto')
      .max(7, 'El teléfono es muy largo')
      .matches(/[0-9]/, "Ingrese solamente números")
  });

  const validate = () => {
    const errors = {};
    setEmail(email.toLowerCase());

    var AuxEmail = email.split('@');
    var code = AuxEmail[0].slice(1);

    if (email === '') {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@itcj\.edu\.mx/.test(email)) {
      errors.email = 'Ingrese un correo institucional, por ejemplo: user@itcj.edu.mx';
    } else if ((email.charAt(0) !== "l" && /^[0-9]*$/.test(code)) || (code.length !== 8 && /^[0-9]*$/.test(code))) {
      errors.email = 'El correo tiene estructura de alumno pero esta mal escrito';
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      motherLastName: '',
      email: '',
      school: 'Instituto Tecnológico de Ciudad Juárez',
      dateRegister: date.toLocaleString().split(' ', 1),
      password: '',
      phone: ''
    },
    validationSchema: RegisterSchema,
    validate,
    onSubmit: () => {
      searchUser();
      validateUserType();

      if (isFind === false) {
        if (advisor === false && admin === false) {
          if (isTypeAorS) {
            setShowAlert({
              message: 'Selecciona el tipo de cuenta',
              show: true,
            });
            setOpen(true);
          } else {
            peticionPostUser('N');
          }
        } else if (advisor) {
          if (isStudent) {
            setShowAlert({
              message: 'La cuenta es de un estudiante, por el momento un estudiante no puede ser asesor',
              show: true,
            });
            setOpen(true);
          } else {
            peticionPostUser('A');
          }
        } else {
          if (isStudent) {
            setShowAlert({
              message: 'La cuenta es de un estudiante, no puede ser administrador',
              show: true,
            });
            setOpen(true);
          } else {
            peticionPostUser('S');
          }
        }
      }
      else {
        setShowAlert({
          message: 'Ya existe una cuenta asociada al correo electrónico ingresado',
          show: true,
        });
        setOpen(true);
      }
    },
  });

  var isFind = false;
  const searchUser = () => {
    data.filter((element) => {
      if (element.userx_email.toLowerCase() === email.toLowerCase()) {
        isFind = true;
      }
      return 0;
    });
  };

  var isStudent = false;
  var isTypeAorS = false;

  function validateUserType() {
    var Aux = email.split('@');
    var code = Aux[0].slice(1);
    if (email.charAt(0) === "l" && /^[0-9]*$/.test(code)) {
      isStudent = true;
      isTypeAorS = false;
    } else {
      isStudent = false;
      isTypeAorS = true;
    }
  }

  function clearData() {
    setEmail('');
    setFieldValue('firstName', '', false);
    setFieldValue('lastName', '', false);
    setFieldValue('motherLastName', '', false);
    setFieldValue('phone', '', false);
    setFieldValue('password', '', false);
    setShowAlert({ message: '', show: false });
    setShowAlertPost(false);
    setAdmin(false);
    setAdvisor(false);
    setStatus(false);
  }

  const peticionPostUser = async (type) => {
    var arrayCode = email.split('@');
    var arrayDate = date.toISOString().split('T');
    await axios.post(`${WS_PATH}users`, {
      userx_code: arrayCode[0],
      userx_name: getFieldProps('firstName').value,
      userx_lastname: getFieldProps('lastName').value,
      userx_mother_lastname: getFieldProps('motherLastName').value,
      userx_email: email,
      userx_password: encryptPassword(getFieldProps('password').value),
      userx_salt: key,
      userx_remember: 'N',
      userx_phone: getFieldProps('phone').value,
      userx_type: type,
      userx_istmp_password: 'N',
      userx_date: arrayDate[0],
      userx_islockedout: 'N',
      userx_islockedout_date: arrayDate[0],
      userx_islockedout_enable_date: arrayDate[0],
      userx_last_login_date: arrayDate[0],
      userx_lastfailed_login_date: arrayDate[0],
      userx_status: accountStatus ? 'A' : 'I',
      userx_image: ''
    })
      .then((response) => {
        if (type === 'N') {
          peticionPostStudent();
        } else if (type === 'A') {
          peticionPostAdvisor(accountStatus);
        } else if (type === 'S') {
          peticionPostAdvisor(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPostStudent = async () => {
    var arrayCode = email.split('@');

    await axios.post(`${WS_PATH}students`, {
      student_code: arrayCode[0],
      student_school: 'ITCJC1',
      student_career: 'SINCS',
      student_major: 'SINES',
      student_semester: 1,
      student_status: accountStatus ? 'A' : 'I',
    })
      .then((response) => {
        clearData();
        setShowAlertPost(true);
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPostAdvisor = async (status) => {
    var arrayCode = email.split('@');

    await axios.post(`${WS_PATH}advisors`, {
      advisor_code: arrayCode[0],
      advisor_rating: 5,
      advisor_comments: "",
      advisor_status: status ? 'A' : 'I',
    })
      .then((response) => {
        clearData();
        setShowAlertPost(true);
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const generateRandomString = (num) => {
    let result1 = Math.random().toString(36).substring(0, num);
    return result1;
  }

  var key = generateRandomString(20);
  const encryptPassword = (text) => {
    var encrypt = CryptoJS.AES.encrypt(text, key).toString();
    return encrypt;
  }

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <Page title={`Asesora${NAME_APP} | Agregar usuario`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Agregar Usuario
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
                color={(accountStatus === false && 'error') || 'success'}
              >
                {changeLabelStatus(accountStatus)}
              </Label>
            </div>

            <Avatar src={`data:image/png;base64,${MockImgAvatar()}`} sx={{ width: '106px', height: '106px', margin: 'auto' }} />

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'center',
              alignItems: 'center', marginTop: '16px', marginBottom: '8px'
            }}>

            </div>

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                <Typography variant='subtitle2' sx={{ wordWrap: 'break-word' }}>
                  Estatus
                </Typography>
                <Typography variant='body2' sx={{ wordWrap: 'break-word' }}>
                  Definir el estado de la cuenta
                </Typography>
              </div>
              <Switch sx={{ pl: 2 }} onChange={() => setStatus(!accountStatus)} checked={accountStatus} />
            </div>

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                <Typography variant='subtitle2' sx={{ wordWrap: 'break-word' }}>
                  Asesor
                </Typography>
                <Typography variant='body2' sx={{ wordWrap: 'break-word' }}>
                  Esta cuenta es asesor
                </Typography>
              </div>
              <Switch sx={{ pl: 2 }} onChange={() => { setAdvisor(!advisor); setAdmin(false); }} checked={advisor} />
            </div>

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                <Typography variant='subtitle2' sx={{ wordWrap: 'break-word' }}>
                  Administrador
                </Typography>
                <Typography variant='body2' sx={{ wordWrap: 'break-word' }}>
                  Esta cuenta es administrador
                </Typography>
              </div>
              <Switch sx={{ pl: 2 }} onChange={() => { setAdmin(!admin); setAdvisor(false); }} checked={admin} />
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
                        value={email.split('@', 1)}
                        disabled
                      />

                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        label="Correo electrónico"
                        value={email}
                        onChange={handleChange}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Escuela"
                        disabled
                        {...getFieldProps('school')}
                      />

                      <TextField
                        fullWidth
                        label="fecha de registro"
                        disabled
                        {...getFieldProps('dateRegister')}
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      label="Nombre"
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Apellido paterno"
                        {...getFieldProps('lastName')}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />

                      <TextField
                        fullWidth
                        label="Apellido materno"
                        {...getFieldProps('motherLastName')}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        {...getFieldProps('password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />

                      <TextField
                        fullWidth
                        label="Teléfono"
                        {...getFieldProps('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Stack>

                    <Stack style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        style={{ width: 'fit-content' }}
                      >
                        Guardar cambios
                      </LoadingButton>
                      {
                        showAlertPost
                        ?
                          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose} sx={{ mt: 10 }}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', boxShadow: 10 }}>
                              Se ha registrado con éxito
                            </Alert>
                          </Snackbar>
                        :
                          null
                      }
                      {
                        showAlert.show
                        ?
                          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose} sx={{ mt: 10 }}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%', boxShadow: 10 }}>
                              {showAlert.message}
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

export default NewUser;