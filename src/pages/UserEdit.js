import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { Card, Stack, Avatar, Container, Typography, TextField, Switch, Snackbar, Alert } from '@mui/material';
import Page from '../components/Page';
import { LoadingButton } from '@mui/lab';
import Label from '../components/Label';
import { useFormik, Form, FormikProvider } from 'formik';
import Scrollbar from '../components/Scrollbar';
import { WS_PATH, NAME_APP } from '../Configurations';
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

function UserEdit() {
  const [accountStatus, setStatus] = useState("");
  const [admin, setAdmin] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [changeType, setChangeType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, color: '' });
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    userx_code: '',
    userx_name: '',
    userx_lastname: '',
    userx_mother_lastname: '',
    userx_email: '',
    userx_phone: '',
    userx_type: '',
    userx_status: '',
    userx_image: ''
  });

  const cookies = new Cookies();
  const navigate = useNavigate();

  var params = useParams();
  var idUser = params.userID;

  const baseUrl = `${WS_PATH}users/${idUser}`;

  const peticionesGet = async () => {
    await axios.get(baseUrl)
      .then(Response => {
        setUser(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
    if (!cookies.get('UserCode')) {
      navigate('/');
    }
  });

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
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
  });

  const formik = useFormik({
    initialValues: {
      code: user.userx_code,
      name: user.userx_name,
      lastName: user.userx_lastname,
      motherLastName: user.userx_mother_lastname,
      email: user.userx_email,
      phone: user.userx_phone,
      password: '**********'
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: () => {
      setLoading(true);
      validateEmailType();
      if (emailStudent) {
        if (currentUserType() === 'A') {
          setShowAlert({
            message: 'La cuenta es de estudiante, por el momento un estudiante no puede ser asesor',
            show: true,
            color: 'error'
          });
          setLoading(false);
          setOpen(true);
        } else if (currentUserType() === 'S') {
          setShowAlert({
            message: 'La cuenta es de un estudiante, no puede ser administrador',
            show: true,
            color: 'error'
          });
          setLoading(false);
          setOpen(true);
        } else {
          peticionPutUser(currentUserStatus(), 'N');
        }
      } else if (emailTypeAorS) {
        if (currentUserType() === 'N') {
          setShowAlert({
            message: 'El correo no es de un alumno, por favor selecciona el tipo de cuenta',
            show: true,
            color: 'error'
          });
          setLoading(false);
          setOpen(true);
        } else {
          if ((currentUserType() === 'A')) {
            peticionPutUser(currentUserStatus(), 'A');
          } else if ((currentUserType() === 'S')) {
            peticionPutUser(currentUserStatus(), 'S');
          }
        }
      }
    }
  });

  var emailStudent = false;
  var emailTypeAorS = false;
  function validateEmailType() {
    var Aux = user.userx_email.split('@');
    var code = Aux[0].slice(1);
    if (user.userx_email.charAt(0) === "l" && /^[0-9]*$/.test(code)) {
      emailStudent = true;
      emailTypeAorS = false;
    } else {
      emailStudent = false;
      emailTypeAorS = true;
    }
  }

  function changeLabelStatus(text) {
    if (text === '') {
      if (user.userx_status === 'I') {
        return sentenceCase('Inactivo');
      } else {
        return sentenceCase('Activo');
      }
    } else if (text === 'A') {
      return sentenceCase('Activo');
    }
    else {
      return sentenceCase('Inactivo');
    }
  }

  function currentUserType() {
    var typeUser = '';

    if (changeType === false) {
      typeUser = user.userx_type;
    } else {
      if (advisor === false && admin === false) {
        typeUser = 'N';
      } else if (advisor) {
        typeUser = 'A';
      } else {
        typeUser = 'S';
      }
    }
    return typeUser;
  }

  function currentUserStatus() {
    var statusUser = '';

    if (accountStatus === '') {
      statusUser = user.userx_status;
    } else {
      statusUser = accountStatus;
    }
    return statusUser;
  }

  const changeSwitch = (type) => {
    if (type === 'S') {
      setAdmin(user.userx_type === 'S' ? false : true);
      setAdvisor(false);
      setChangeType(true);
    }
    if (type === 'A') {
      setAdvisor(user.userx_type === 'A' ? false : true);
      setAdmin(false);
      setChangeType(true);
    }
  }

  const peticionPutUser = async (status, type) => {
    await axios.put(baseUrl, {
      userx_code: user.userx_code,
      userx_name: getFieldProps('name').value,
      userx_lastname: getFieldProps('lastName').value,
      userx_mother_lastname: getFieldProps('motherLastName').value,
      userx_email: user.userx_email,
      userx_password: user.userx_password,
      userx_salt: user.userx_salt,
      userx_remember: user.userx_remember,
      userx_phone: getFieldProps('phone').value,
      userx_type: type,
      userx_istmp_password: user.userx_istmp_password,
      userx_date: user.userx_date,
      userx_islockedout: user.userx_islockedout,
      userx_islockedout_date: user.userx_islockedout_date,
      userx_islockedout_enable_date: user.userx_islockedout_enable_date,
      userx_last_login_date: user.userx_last_login_date,
      userx_lastfailed_login_date: user.userx_lastfailed_login_date,
      userx_status: status,
      userx_image: user.userx_image
    }).then(response => {
      if (type === 'N') {
        peticionPutStudent(status);
      } else if (type === 'A') {
        peticionPutAdvisor(status);
      } else if (type === 'S') {
        peticionPutAdvisor('I');
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const peticionPutStudent = (status) => {
    var UrlStudent = `${WS_PATH}students/${idUser}`;
    axios.get(UrlStudent)
      .then(Response => {
        axios.put(UrlStudent, {
          student_code: Response.data.student_code,
          student_school: Response.data.student_school,
          student_career: Response.data.student_career,
          student_major: Response.data.student_major,
          student_semester: Response.data.student_semester,
          student_status: status,
        }).then(response => {
          setShowAlert({
            message: '¡Se guardaron los cambios con éxito!',
            show: true,
            color: 'success'
          });
          setLoading(false);
          setOpen(true);
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPutAdvisor = (status) => {
    var UrlAdvisor = `${WS_PATH}advisors/${idUser}`;
    axios.get(UrlAdvisor)
      .then(Response => {
        axios.put(UrlAdvisor, {
          advisor_code: idUser,
          advisor_rating: Response.data.advisor_rating,
          advisor_comments: Response.data.advisor_comments,
          advisor_status: status,
        }).then(response => {
          setShowAlert({
            message: '¡Se guardaron los cambios con éxito!',
            show: true,
            color: 'success'
          });
          setLoading(false);
          setOpen(true);
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Page title={`Asesora${NAME_APP} | Editar Usuario`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Editar usuario
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
                color={
                  accountStatus === ''
                  ?
                    (user.userx_status === 'I' && 'error') || 'success'
                  :
                    (accountStatus === 'I' && 'error') || 'success'
                }
              >
                {changeLabelStatus(accountStatus)}
              </Label>
            </div>

            <Avatar src={`data:image/png;base64,${user.userx_image}`} sx={{ width: '106px', height: '106px', margin: 'auto' }} />

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
              {
                accountStatus === ''
                ?
                  <Switch sx={{ pl: 2 }} onChange={() => setStatus(user.userx_status === 'I' ? 'A' : 'I')} checked={user.userx_status === 'I' ? false : true} />
                :
                  <Switch sx={{ pl: 2 }} onChange={() => setStatus(accountStatus === 'I' ? 'A' : 'I')} checked={accountStatus === 'I' ? false : true} />
              }
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
                  Activar convertir en asesor
                </Typography>
              </div>
              {
                advisor === ''
                ?
                  <Switch sx={{ pl: 2 }} onChange={() => changeSwitch('A')} checked={user.userx_type === 'A' ? true : false} />
                :
                  <Switch sx={{ pl: 2 }} onChange={() => { setAdvisor(!advisor); setAdmin(false); }} checked={advisor} />
              }

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
                  Activar convertir en adnimistrador
                </Typography>
              </div>
              {
                admin === ''
                ?
                  <Switch sx={{ pl: 2 }} onChange={() => changeSwitch('S')} checked={user.userx_type === 'S' ? true : false} />
                :
                  <Switch sx={{ pl: 2 }} onChange={() => { setAdmin(!admin); setAdvisor(false); }} checked={admin} />
              }

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
                        {...getFieldProps('code')}
                        disabled
                      />

                      <TextField
                        fullWidth
                        type="email"
                        label="Correo electrónico"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        disabled
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      label="Nombre"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
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
                        error={Boolean(touched.motherLastName && errors.motherLastName)}
                        helperText={touched.motherLastName && errors.motherLastName}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        disabled
                        {...getFieldProps('password')}
                      />

                      <TextField
                        fullWidth
                        label="Teléfono"
                        {...getFieldProps('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                        disabled
                      />
                    </Stack>

                    <Stack style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={loading}
                        style={{ width: 'fit-content' }}
                      >
                        Guardar cambios
                      </LoadingButton>

                      {
                        showAlert.show
                        ?
                          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose} sx={{ mt: 10 }}>
                            <Alert onClose={handleClose} severity={showAlert.color} sx={{ width: '100%', boxShadow: 10 }}>
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

export default UserEdit;