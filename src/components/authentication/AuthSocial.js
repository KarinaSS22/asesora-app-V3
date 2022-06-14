import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import upcScan from '@iconify/icons-bi/upc-scan';
import { Stack, Button, Divider, Typography, Tooltip, Dialog, DialogContent, Snackbar, Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import Scanner from './scannerLogin/Scanner';
import googleFill from '@iconify/icons-eva/google-fill';
import { WS_PATH } from '../../Configurations';
import GoogleLogin from 'react-google-login';
import Quagga from 'quagga';
import Cookies from 'universal-cookie';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AuthSocial() {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, duration: 0 });
  const [openAlert, setOpenAlert] = useState(false);
  const [user, setUser] = useState([]);

  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    Quagga.stop();
    setOpen(false);
  }

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

  const responseGoogle = (response) => {
    searchUser(response.profileObj.email);
    if (isFind && status === "A") {
      cookies.set('UserCode', code, { path: '/' });
      cookies.set('UserType', type, { path: '/' });
      navigate('/dashboard', { replace: true });
    } if (isFind && status === "I") {
      setShowAlert({
        message: 'No puedes ingresar a tu cuenta, contacta a tu administrador de sistema para mayor información',
        show: true,
        duration: 8000,
      });
      setOpenAlert(true);
    } else {
      setShowAlert({
        message: 'El correo ingresado no se encuentra registrado',
        show: true,
        duration: 6000,
      });
      setOpenAlert(true);
    }
  }

  var isFind = false;
  var code = "";
  var type = "";
  var status = "";
  const searchUser = (finded) => {
    user.filter((element) => {
      if (element.userx_email.toLowerCase() === finded.toLowerCase()) {
        isFind = true;
        code = element.userx_code;
        type = element.userx_type;
        status = element.userx_status;
      }
      return 0;
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setShowAlert(false);
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Tooltip title="Escanear credencial" placement="top" enterDelay={200} arrow>
          <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleClickOpen}>
            <Icon icon={upcScan} color="#454F5B" height={24} />
          </Button>
        </Tooltip>

        <GoogleLogin
          clientId="403325894307-riktnlopiv84g0mjisqa6b9rgclkeigo.apps.googleusercontent.com"
          render={renderProps => (
            <Tooltip title="Iniciar sesión con Google" placement="top" enterDelay={200} arrow>
              <Button fullWidth size="large" color="inherit" variant="outlined" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <Icon icon={googleFill} color="#DF3E30" height={24} />
              </Button>
            </Tooltip>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          O
        </Typography>
      </Divider>

      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogContent>
          <Scanner />
          <canvas class="drawingBuffer" width="1" height="20"></canvas>
        </DialogContent>
      </Dialog>

      {
        showAlert.show
        ?
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={showAlert.duration} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
              {showAlert.message}
            </Alert>
          </Snackbar>
        :
          null
      }
    </>
  );
}

export default AuthSocial;