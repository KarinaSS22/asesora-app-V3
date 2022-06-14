import React, { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import slashOutline from '@iconify/icons-eva/slash-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Dialog, DialogContent,
  DialogActions, Button, DialogTitle, Snackbar, Alert } from '@mui/material';
import { WS_PATH } from '../../../Configurations';
import Slide from '@mui/material/Slide';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserMoreMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, color: '' });
  const [openAlert, setOpenAlert] = useState(false);
  const [user, setUser] = useState([]);

  const ref = useRef(null);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
    setIsOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const requestGet = async () => {
    await axios.get(`${WS_PATH}users/${props.idUser}`)
      .then(response => {
        setUser(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    requestGet();
  });

  const inactivateUser = () => {
    setOpen(false);
    if (user.userx_status === 'I') {
      setShowAlert({
        message: 'El usuario ya se encuentra inactivo',
        show: true,
        color: 'warning'
      });
      setOpenAlert(true);
    } else {
      if (user.userx_type === 'N') {
        peticionPutUser('N');
      } else if (user.userx_type === 'A') {
        peticionPutUser('A');
      } else {
        peticionPutUser('S');
      }
    }
  }

  const peticionPutUser = async (modification) => {
    await axios.put(`${WS_PATH}users/${props.idUser}`, {
      userx_code: user.userx_code,
      userx_name: user.userx_name,
      userx_lastname: user.userx_lastname,
      userx_mother_lastname: user.userx_mother_lastname,
      userx_email: user.userx_email,
      userx_password: user.userx_password,
      userx_salt: user.userx_salt,
      userx_remember: user.userx_remember,
      userx_phone: user.userx_phone,
      userx_type: user.userx_type,
      userx_istmp_password: user.userx_istmp_password,
      userx_date: user.userx_date,
      userx_islockedout: user.userx_islockedout,
      userx_islockedout_date: user.userx_islockedout_date,
      userx_islockedout_enable_date: user.userx_islockedout_enable_date,
      userx_last_login_date: user.userx_last_login_date,
      userx_lastfailed_login_date: user.userx_lastfailed_login_date,
      userx_status: 'I',
      userx_image: user.userx_image
    }).then(response => {
      if (modification === 'N') {
        peticionPutStudent();
      } else if (modification === 'A') {
        peticionPutAdvisor();
      } else if (modification === 'S') {
        navigate('/dashboard/user-edit/' + props.idUser);
        navigate('/dashboard/user');
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const peticionPutStudent = () => {
    var UrlStudent = `${WS_PATH}students/${props.idUser}`;
    axios.get(UrlStudent)
      .then(Response => {
        axios.put(UrlStudent, {
          student_code: Response.data.student_code,
          student_school: Response.data.student_school,
          student_career: Response.data.student_career,
          student_major: Response.data.student_major,
          student_semester: Response.data.student_semester,
          student_status: 'I',
        }).then(response => {
          navigate(`/dashboard/user-edit/${props.idUser}`);
          navigate('/dashboard/user');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPutAdvisor = () => {
    var UrlAdvisor = `${WS_PATH}advisors/${props.idUser}`;
    axios.get(UrlAdvisor)
      .then(Response => {
        axios.put(UrlAdvisor, {
          advisor_code: Response.data.advisor_code,
          advisor_rating: Response.data.advisor_rating,
          advisor_comments: Response.data.advisor_comments,
          advisor_status: 'I',
        }).then(response => {
          navigate(`/dashboard/user-edit/${props.idUser}`);
          navigate('/dashboard/user');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={handleClickOpen}>
          <ListItemIcon>
            <Icon icon={slashOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Inactivar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`/dashboard/user-edit/${props.idUser}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>

      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle>Inactivar usuario</DialogTitle>
        <DialogContent>
          ¿Estas seguro de querer inactivar al usuario <b>{props.name}</b>?
          Esta acción se podrá revertir editando el usuario
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
          <Button fullWidth onClick={inactivateUser}>Aceptar</Button>
          <Button fullWidth variant="contained" onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {
        showAlert.show
        ?
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert} sx={{ mt: 10 }}>
            <Alert onClose={handleCloseAlert} severity={showAlert.color} sx={{ width: '100%', boxShadow: 10, marginTop: 10 }}>
              {showAlert.message}
            </Alert>
          </Snackbar>
        :
          null
      }
    </>
  );
}

export default UserMoreMenu;
