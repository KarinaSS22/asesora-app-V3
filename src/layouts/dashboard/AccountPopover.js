import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settingsFill from '@iconify/icons-eva/settings-fill';
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
import MenuPopover from '../../components/MenuPopover';
import MockImgAvatar from '../../utils/mockImages';
import { WS_PATH } from '../../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

const MENU_OPTIONS = [
  {
    label: 'Inicio',
    icon: homeFill,
    linkTo: '/dashboard'
  },
  {
    label: 'Mi perfil',
    icon: personFill,
    linkTo: '/dashboard/my-profile'
  },
  {
    label: 'Configuraciones',
    icon: settingsFill,
    linkTo: '/comming'
  }
];

const cookies = new Cookies();

function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [infoUser, setInfoUser] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const onSubmit = () => {
    cookies.remove('UserCode', { path: '/' });
    cookies.remove('UserType', { path: '/' });
    navigate('/');
  }

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}users/${cookies.get('UserCode')}`)
      .then(Response => {
        setInfoUser(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
  });

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={`data:image/png;base64,
          ${infoUser.userx_image !== '' ? infoUser.userx_image : MockImgAvatar()}`}
          alt="photoURL"
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {`${infoUser.userx_name} ${infoUser.userx_lastname}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {infoUser.userx_email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={onSubmit}>
            Cerrar sesión
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

export default AccountPopover;