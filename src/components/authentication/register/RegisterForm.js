import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Stack, TextField, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { WS_PATH } from '../../../Configurations';
import { LoadingButton } from '@mui/lab';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, color: '' });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const date = new Date();

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
    email: Yup.string()
      .email('El correo electrónico debe ser una dirección válida')
      .required('El correo electrónico es obligatorio')
      .matches(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@itcj\.edu\.mx/,
        'Ingrese su correo institucional, por ejemplo: user@itcj.edu.mx'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(8, 'La contraseña debe contener mínimo 8 caracteres')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      motherLastName: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      searchUser(getFieldProps('email').value);
      validateUserType();

      if (isFind === false) {
        if (isTypeAorS) {
          peticionPostUser('A');
        } else if (isStudent) {
          peticionPostUser('N');
        }
      } else {
        setShowAlert({
          message: 'Ya se tiene una cuenta asociada al correo ingresado',
          show: true,
          color: 'error'
        });
        setOpen(true);
      }
    },
  });

  var isFind = false;
  const searchUser = (finded) => {
    data.filter((element) => {
      if (element.userx_email.toLowerCase() === finded.toLowerCase()) {
        isFind = true;
      }
      return 0;
    });
  };

  var isStudent = false;
  var isTypeAorS = false;

  function validateUserType() {
    var Aux = getFieldProps('email').value.split('@');
    var code = Aux[0].slice(1);
    if (getFieldProps('email').value.charAt(0) === 'l' && /^[0-9]*$/.test(code)) {
      isStudent = true;
      isTypeAorS = false;
    } else {
      isStudent = false;
      isTypeAorS = true;
    }
  }

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

  const peticionPostUser = async (type) => {
    var arrayCode = getFieldProps('email').value.split('@');
    var arrayDate = date.toISOString().split('T');
    await axios.post(`${WS_PATH}users`, {
      userx_code: arrayCode[0],
      userx_name: getFieldProps('name').value,
      userx_lastname: getFieldProps('lastName').value,
      userx_mother_lastname: getFieldProps('motherLastName').value,
      userx_email: getFieldProps('email').value,
      userx_password: encryptPassword(getFieldProps('password').value),
      userx_salt: key,
      userx_remember: 'N',
      userx_phone: '',
      userx_type: type,
      userx_istmp_password: 'N',
      userx_date: arrayDate[0],
      userx_islockedout: 'N',
      userx_islockedout_date: arrayDate[0],
      userx_islockedout_enable_date: arrayDate[0],
      userx_last_login_date: arrayDate[0],
      userx_lastfailed_login_date: arrayDate[0],
      userx_status: 'A',
      userx_image: ''
    })
      .then((response) => {
        if (type === 'N') {
          peticionPostStudent(arrayCode[0]);
        } else if (type === 'A') {
          peticionPostAdvisor(arrayCode[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPostStudent = async (code) => {
    await axios.post(`${WS_PATH}students`, {
      student_code: code,
      student_school: 'ITCJC1',
      student_career: 'SINCS',
      student_major: 'SINES',
      student_semester: 1,
      student_status: 'A',
    })
      .then((response) => {
        setShowAlert({
          message: '¡Se registró con éxito el correo de alumno ingresado!',
          show: true,
          color: 'success'
        });
        setOpen(true);
        setFieldValue('name', '', false);
        setFieldValue('lastName', '', false);
        setFieldValue('motherLastName', '', false);
        setFieldValue('email', '', false);
        setFieldValue('password', '', false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPostAdvisor = async (code) => {
    await axios.post(`${WS_PATH}advisors`, {
      advisor_code: code,
      advisor_rating: 5,
      advisor_comments: '',
      advisor_status: 'A',
    })
      .then((response) => {
        setShowAlert({
          message: '¡Se registró con éxito el correo de asesor ingresado!',
          show: true,
          color: 'success'
        });
        setOpen(true);
        setFieldValue('name', '', false);
        setFieldValue('lastName', '', false);
        setFieldValue('motherLastName', '', false);
        setFieldValue('email', '', false);
        setFieldValue('password', '', false);
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
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
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

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Correo electrónico"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Registrarse
          </LoadingButton>

          {
            showAlert.show
            ?
              <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={showAlert.color} sx={{ width: '100%', boxShadow: 10 }}>
                  {showAlert.message}
                </Alert>
              </Snackbar>
            :
              null
          }

        </Stack>
      </Form>
    </FormikProvider>
  );
}

export default RegisterForm;
