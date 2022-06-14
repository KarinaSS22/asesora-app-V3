import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
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

function SubjectMoreMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, color: '' });
  const [openAlert, setOpenAlert] = useState(false);
  const [subject, setSubject] = useState([]);

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
    await axios.get(`${WS_PATH}subjects/${props.idSubject}`)
      .then(response => {
        setSubject(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    requestGet();
  });

  const inactivateSubject = () => {
    setOpen(false);
    if (subject.subjectx_status === 'I') {
      setShowAlert({
        message: 'La materia ya se encuentra inactiva',
        show: true,
        color: 'warning'
      });
      setOpenAlert(true);
    } else {
      putSubject();
    }
  }

  const putSubject = () => {
    var UrlSubject = `${WS_PATH}subjects/${props.idSubject}`;
    axios.get(UrlSubject)
      .then(response => {
        axios.put(UrlSubject, {
          subjectx_id: response.data.subjectx_id,
          subjectx_code: response.data.subjectx_code,
          subjectx_name: response.data.subjectx_name,
          subjectx_credits: response.data.subjectx_credits,
          subjectx_career: response.data.subjectx_career,
          subjectx_major: response.data.subjectx_major,
          subjectx_classroom: response.data.subjectx_classroom,
          subjectx_status: 'I'
        }).then(response => {
          navigate('/dashboard/new-subject');
          window.location.reload(false);
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
      </Menu>

      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle>Inactivar materia</DialogTitle>
        <DialogContent>
          ¿Estas seguro de querer inactivar la materia <b>{props.name}</b>?
          Esta acción no se podrá revertir
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
          <Button fullWidth onClick={inactivateSubject}>Aceptar</Button>
          <Button fullWidth variant="contained" onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {
        showAlert.show
        ?
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
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

export default SubjectMoreMenu;