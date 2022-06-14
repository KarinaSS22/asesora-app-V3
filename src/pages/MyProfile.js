import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import cameraFill from '@iconify/icons-eva/camera-fill';
import startFill from '@iconify/icons-eva/star-fill';
import { Card, Stack, Avatar, Container, Typography, TextField, Switch, Snackbar, Alert, Button, 
  IconButton, Tooltip, DialogActions, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Page from '../components/Page';
import { LoadingButton } from '@mui/lab';
import Label from '../components/Label';
import { useFormik, Form, FormikProvider } from 'formik';
import Scrollbar from '../components/Scrollbar';
import { WS_PATH, NAME_APP } from '../Configurations';
import Slide from '@mui/material/Slide';
import Cookies from 'universal-cookie';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ContainerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

function changeLabelStatus(text) {
  if (text === 'A') {
    return 'Activo';
  }
  else {
    return 'Inactivo';
  }
}

const Input = styled('input')({
  display: 'none',
});

function MyProfile() {
  const [photo, setPhoto] = useState('');
  const [changePhoto, setChangePhoto] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false });
  const [open, setOpen] = useState(false);
  const [biography, setBiography] = useState('Escriba su biografía...');
  const [advisor, setAdvisor] = useState([]);
  const [errorBiography, setErrorBiography] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({
    userx_code: '',
    userx_name: '',
    userx_lastname: '',
    userx_mother_lastname: '',
    userx_email: '',
    userx_phone: '',
    userx_type: '',
    userx_status: '',
    userx_image: '',
    userx_date: ''
  });

  const cookies = new Cookies();
  const navigate = useNavigate();

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}users/${cookies.get('UserCode')}`)
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

  const peticionPut = async () => {
    await axios.put(`${WS_PATH}users/${cookies.get('UserCode')}`, {
      userx_code: getFieldProps('code').value,
      userx_name: getFieldProps('firstName').value,
      userx_lastname: getFieldProps('lastName').value,
      userx_mother_lastname: getFieldProps('motherLastName').value,
      userx_email: getFieldProps('email').value,
      userx_password: getFieldProps('password').value === '**********' ? user.userx_password : encryptPassword(getFieldProps('password').value),
      userx_salt: getFieldProps('password').value === '**********' ? user.userx_salt : key,
      userx_remember: user.userx_remember,
      userx_phone: getFieldProps('phone').value,
      userx_type: user.userx_type,
      userx_istmp_password: user.userx_istmp_password,
      userx_date: user.userx_date,
      userx_islockedout: user.userx_islockedout,
      userx_islockedout_date: user.userx_islockedout_date,
      userx_islockedout_enable_date: user.userx_islockedout_enable_date,
      userx_last_login_date: user.userx_last_login_date,
      userx_lastfailed_login_date: user.userx_lastfailed_login_date,
      userx_status: user.userx_status,
      userx_image: changePhoto ? photo : user.userx_image
    }).then(response => {
      setShowAlert({
        message: '¡Se guardaron los cambios con éxito!',
        show: true,
      });
      setOpen(true);
    }).catch(error => {
      console.log(error);
    });
  }

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
    email: Yup.string()
      .email('El correo electrónico debe ser una dirección válida')
      .required('El correo electrónico es obligatorio'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(8, "La contraseña debe contener mínimo 8 caracteres"),
    phone: Yup.string()
      .min(2, 'El teléfono es muy corto')
      .max(7, 'El teléfono es muy largo')
      .matches(/[0-9]/, "Ingrese solamente números")
  });

  const formik = useFormik({
    initialValues: {
      code: user.userx_code,
      firstName: user.userx_name,
      lastName: user.userx_lastname,
      motherLastName: user.userx_mother_lastname,
      email: user.userx_email,
      school: 'Instituto Tecnológico de Ciudad Juárez',
      dateRegister: (user.userx_date).split("T", 1),
      password: '**********',
      phone: user.userx_phone
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: () => {
      peticionPut();
    }
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setShowAlert({ message: '', show: false });
  };

  const convertBase64 = (photo) => {
    Array.from(photo).forEach(ele => {
      var reader = new FileReader();
      reader.readAsDataURL(ele);
      reader.onload = function () {
        var arrayAux = [];
        var base64 = reader.result;
        arrayAux = base64.split(',');
        setPhoto(arrayAux[1]);
        setChangePhoto(true);
      }
    })
  }

  const generateRandomString = (num) => {
    let result1 = Math.random().toString(36).substring(0, num);
    return result1;
  }

  var key = generateRandomString(30);
  const encryptPassword = (text) => {
    var encrypt = CryptoJS.AES.encrypt(text, key).toString();
    return encrypt;
  }

  const peticionesGetAdvisor = async () => {
    await axios.get(`${WS_PATH}advisors/${cookies.get('UserCode')}`)
      .then(Response => {
        setAdvisor(Response.data);
        if (Response.data.advisor_comments !== '') {
          setBiography(Response.data.advisor_comments);
        }
      }).catch(error => {
        console.log(error);
      })
  }

  const handleEventClick = () => {
    peticionesGetAdvisor();
    setOpenDialog(true);
  }

  const dialogClose = () => {
    setOpenDialog(false);
    setBiography('Escriba su biografía...');
  }

  const handleChange = (event) => {
    setBiography(event.target.value);
  };

  const peticionPutAdvisor = async () => {
    await axios.put(`${WS_PATH}advisors/${cookies.get('UserCode')}`, {
      advisor_code: advisor.advisor_code,
      advisor_rating: advisor.advisor_rating,
      advisor_comments: biography === 'Escriba su biografía...' ? advisor.advisor_comments : biography,
      advisor_status: advisor.advisor_status,
    })
      .then((response) => {
        setOpenDialog(false);
        setShowAlert({
          message: '¡Se actualizó la biografía!',
          show: true,
        });
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const saveBiography = () => {
    if (biography.length > 250) {
      setErrorBiography(true);
    } else {
      peticionPutAdvisor();
    }
  }

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <Page title={`Asesora${NAME_APP} | Mi perfil`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mi perfil
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
                color={(user.userx_status === 'inactivo' && 'error') || 'success'}
              >
                {changeLabelStatus(user.userx_status)}
              </Label>
            </div>

            {
              changePhoto
              ?
                <Avatar src={`data:image/png;base64,${photo}`} sx={{ width: '106px', height: '106px', margin: 'auto' }} />
              :
                <Avatar src={`data:image/png;base64,${user.userx_image}`} sx={{ width: '106px', height: '106px', margin: 'auto' }} />
            }
            <div style={{ position: 'absolute', right: '31%', top: '30%', display: 'flex', alignItems: 'center' }}>
              <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => convertBase64(e.target.files)}
                  hidden />
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <Tooltip title="Subir imagen" placement="top" arrow>
                    <Icon icon={cameraFill} width="26px" />
                  </Tooltip>
                </IconButton>
              </label>
            </div>

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'center',
              alignItems: 'center', marginTop: '16px', marginBottom: '8px'
            }}>
              <Typography variant='caption' sx={{ width: '70%', wordWrap: 'break-word', textAlign: 'center' }}>
                Permitido *.jpeg, *.jpg, *.png tamaño maximo de 3 MB
              </Typography>

            </div>
            {
              cookies.get('UserType') === 'A'
              ?
                <div style={{
                  width: '100%', display: 'flex', justifyContent: 'center',
                  alignItems: 'center', marginTop: '4px', marginBottom: '8px'
                }}>
                  <Button
                    startIcon={<Icon icon={editFill} />}
                    onClick={handleEventClick}
                  >
                    Editar Biografía
                  </Button>
                </div>
              :
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
                  <Switch sx={{ pl: 2 }} checked={user.userx_status === 'inactivo' ? false : true} disabled />
                </div>
            }

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
              <Switch sx={{ pl: 2 }} checked={user.userx_type === 'A' ? true : false} disabled />
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
              <Switch sx={{ pl: 2 }} checked={user.userx_type === 'S' ? true : false} disabled />
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
                        disabled
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
                    </Stack>
                  </Stack>
                </Form>
              </FormikProvider>
              {
                showAlert.show
                ?
                  <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose} sx={{ mt: 10 }}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%', boxShadow: 10 }}>
                      {showAlert.message}
                    </Alert>
                  </Snackbar>
                :
                  null
              }
            </Scrollbar>
          </Card>
        </ContainerStyle>
      </Container>
      <Dialog open={openDialog} TransitionComponent={Transition} onClose={dialogClose} fullWidth={true}
        maxWidth={'xs'}>
        <DialogTitle>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography gutterBottom variant="h7" sx={{ m: 0, mr: 1 }}>
              Información de biografía
            </Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 1 }}>
              {`${advisor.advisor_rating}${".0"}`}&nbsp;
              <Icon icon={startFill} style={{ color: '#E7CC13' }} />
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          {
            <Stack spacing={2} sx={{ padding: '12px' }}>
              <TextField
                fullWidth
                label="Ocupación"
                value={'Asesor en ITCJ'}
                disabled
              />
              {
                errorBiography
                ?
                  <TextField
                    multiline
                    label="Biografía"
                    value={biography}
                    onChange={handleChange}
                    error
                    helperText="Máximo 250 caracteres"
                  />
                :
                  <TextField
                    multiline
                    label="Biografía"
                    value={biography}
                    onChange={handleChange}
                  />
              }

            </Stack>
          }
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '75%', ml: '75%' }}>
          <Button fullWidth onClick={saveBiography}>Guardar</Button>
          <Button fullWidth variant="contained" onClick={dialogClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Page >
  );
}

export default MyProfile;
