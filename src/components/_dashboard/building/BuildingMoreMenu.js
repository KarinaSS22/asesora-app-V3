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

function BuildingMoreMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', show: false, color: '' });
  const [openAlert, setOpenAlert] = useState(false);
  const [building, setBuilding] = useState([]);

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
    await axios.get(`${WS_PATH}buildings/${props.idBuilding}`)
      .then(response => {
        setBuilding(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    requestGet();
  });

  const inactivateUser = () => {
    setOpen(false);
    if (building.building_status === 'I') {
      setShowAlert({
        message: 'El edificio ya se encuentra inactivo',
        show: true,
        color: 'warning'
      });
      setOpenAlert(true);
    } else {
      putBuilding();
    }
  }

  const putBuilding = () => {
    var UrlBuilding = `${WS_PATH}buildings/${props.idBuilding}`;
    axios.get(UrlBuilding)
      .then(response => {
        axios.put(UrlBuilding, {
          building_code: response.data.building_code,
          building_name: response.data.building_name,
          building_school: response.data.building_school,
          building_status: 'I'
        }).then(response => {
          navigate('/dashboard/buildings');
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
        <DialogTitle>Inactivar edificio</DialogTitle>
        <DialogContent>
          ¿Estas seguro de querer inactivar el edificio <b>{props.name}</b>?
          Esta acción no se podrá revertir
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, maxWidth: '50%', ml: '50%' }}>
          <Button fullWidth onClick={inactivateUser}>Aceptar</Button>
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

export default BuildingMoreMenu;