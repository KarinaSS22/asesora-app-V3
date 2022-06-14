import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
import sidebarConfigStudent from './SidebarConfigStudent';
import sidebarConfigAdvisor from './SidebarConfigAdvisor';
import sidebarConfigAdm from './SidebarConfigAdm';
import account from '../../_mocks_/account';
import MockImgAvatar from '../../utils/mockImages';
import { WS_PATH } from '../../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const [infoUser, setInfoUser] = useState([]);

  const cookies = new Cookies();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
    if (!cookies.get('UserCode')) {
      navigate('/');
    }
  })


  const selectSidebarConfig = () => {
    if (cookies.get('UserType') === 'N') {
      return (sidebarConfigStudent);
    } else if (cookies.get('UserType') === 'A') {
      return (sidebarConfigAdvisor);
    } else if (cookies.get('UserType') === 'S') {
      return (sidebarConfigAdm);
    } else {
      return (sidebarConfigStudent);
    }
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="#" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={`data:image/png;base64,
              ${infoUser.userx_image !== '' ? infoUser.userx_image : MockImgAvatar()}`}
              alt="photoURL"
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {`${infoUser.userx_name} ${infoUser.userx_lastname}`}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={selectSidebarConfig()} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}

export default DashboardSidebar;