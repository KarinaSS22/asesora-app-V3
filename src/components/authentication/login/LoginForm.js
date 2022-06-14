import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { WS_PATH } from '../../../Configurations';
import CryptoJS from 'crypto-js';
import Cookies from 'universal-cookie';
import axios from 'axios';

function LoginForm() {
  const [user, setUser] = useState([]);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, duration: 0 });
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cookies = new Cookies();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("El correo electrónico debe ser una dirección válida")
      .required("El correo electrónico es obligatorio")
      .matches(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@itcj.edu.mx/,
        'Ingrese su correo institucional, por ejemplo: user@itcj.edu.mx'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
  });

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}users`)
      .then(Response => {
        setUser(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
  });

  const formik = useFormik({
    initialValues: {
      email: cookies.get('UserEmail') ? cookies.get('UserEmail') : "",
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      searchUser(getFieldProps("email").value);
      if (isFind) {
        if (correctPassword) {
          if (status === "A") {
            if (getFieldProps('remember').value) {
              cookies.set('UserEmail', getFieldProps("email").value, { path: '/' });
            } else {
              cookies.remove('UserEmail', { path: '/' });
            }
            cookies.set('UserCode', code, { path: '/' });
            cookies.set('UserType', type, { path: '/' });
            navigate('/dashboard', { replace: true });
          } else {
            setShowAlert({
              message: 'No puedes ingresar a tu cuenta, contacta a tu administrador de sistema para mayor información',
              show: true,
              duration: 8000,
            });
            setOpen(true);
          }
        } else {
          setShowAlert({
            message: 'Datos erróneos. Por favor, inténtalo otra vez',
            show: true,
            duration: 6000,
          });
          setOpen(true);
        }
      } else {
        setShowAlert({
          message: 'El correo ingresado no se encuentra registrado',
          show: true,
          duration: 6000,
        });
        setOpen(true);
      }
    }
  });

  const decryptPassword = (text, key) => {
    var bytes = CryptoJS.AES.decrypt(text, key);
    var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }

  var isFind = false;
  var code = "";
  var type = "";
  var correctPassword = false;
  var status = "";
  
  const searchUser = (finded) => {
    user.filter((element) => {
      if (element.userx_email.toLowerCase() === finded.toLowerCase()) {
        isFind = true;
        if (decryptPassword(element.userx_password, element.userx_salt) === getFieldProps("password").value) {
          correctPassword = true;
          code = element.userx_code;
          type = element.userx_type;
          status = element.userx_status;
        }
      }
      return 0;
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setShowAlert(false);
  }

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember}
              style={{ borderRadius: 12 }} />}
            label="Recuérdame"
          />

          <Link to="/reset-password" target="_self" rel="noopener" component={RouterLink} variant="subtitle2">
            ¿Olvidaste tú contraseña?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Iniciar sesión
        </LoadingButton>
        {
          showAlert.show
          ?
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={showAlert.duration} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%', boxShadow: 10 }}>
                {showAlert.message}
              </Alert>
            </Snackbar>
          :
            null
        }
      </Form>
    </FormikProvider>
  );
}

export default LoginForm;