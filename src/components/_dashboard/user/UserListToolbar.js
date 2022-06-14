import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import slashOutline from '@iconify/icons-eva/slash-outline';
import { styled } from '@mui/material/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';
import Slide from '@mui/material/Slide';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  selectedRow: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserListToolbar({ numSelected, selectedRow, filterName, onFilterName }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const requestGet = async () => {
    await axios.get(`${WS_PATH}users`)
      .then(response => {
        setUser(response.data);
      }).catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    requestGet();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const inactivateUsers = () => {
    setOpen(false);
    for (let i = 0; i < selectedRow.length; i++) {
      user.filter((element) => {
        if (element.userx_code === selectedRow[i]) {
          if ((i + 1) === numSelected) {
            peticionPutUser(element, true);
          } else {
            peticionPutUser(element, false);
          }
        }
        return 0;
      });
    }
  }

  const peticionPutUser = async (userInfo, final) => {
    await axios.put(`${WS_PATH}users/${userInfo.userx_code}`, {
      userx_code: userInfo.userx_code,
      userx_name: userInfo.userx_name,
      userx_lastname: userInfo.userx_lastname,
      userx_mother_lastname: userInfo.userx_mother_lastname,
      userx_email: userInfo.userx_email,
      userx_password: userInfo.userx_password,
      userx_salt: userInfo.userx_salt,
      userx_remember: userInfo.userx_remember,
      userx_phone: userInfo.userx_phone,
      userx_type: userInfo.userx_type,
      userx_istmp_password: userInfo.userx_istmp_password,
      userx_date: userInfo.userx_date,
      userx_islockedout: userInfo.userx_islockedout,
      userx_islockedout_date: userInfo.userx_islockedout_date,
      userx_islockedout_enable_date: userInfo.userx_islockedout_enable_date,
      userx_last_login_date: userInfo.userx_last_login_date,
      userx_lastfailed_login_date: userInfo.userx_lastfailed_login_date,
      userx_status: 'I',
      userx_image: userInfo.userx_image
    }).then(response => {
      if (userInfo.userx_type === 'N') {
        peticionPutStudent(userInfo.userx_code, final);
      } else if (userInfo.userx_type === 'A') {
        peticionPutAdvisor(userInfo.userx_code, final);
      } else if ((userInfo.userx_type === 'S') && (final === true)) {
        navigate(`/dashboard/user-edit/${userInfo.userx_code}`);
        navigate('/dashboard/user');
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const peticionPutStudent = (idUser, final) => {
    var UrlStudent = `${WS_PATH}students/${idUser}`;
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
          if (final) {
            navigate(`/dashboard/user-edit/${idUser}`);
            navigate('/dashboard/user');
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPutAdvisor = (idUser, final) => {
    var UrlAdvisor = `${WS_PATH}advisors/${idUser}`;
    axios.get(UrlAdvisor)
      .then(Response => {
        axios.put(UrlAdvisor, {
          advisor_code: Response.data.advisor_code,
          advisor_rating: Response.data.advisor_rating,
          advisor_comments: Response.data.advisor_comments,
          advisor_status: 'I',
        }).then(response => {
          if (final) {
            navigate(`/dashboard/user-edit/${idUser}`);
            navigate('/dashboard/user');
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }


  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {
        numSelected > 0
        ?
          <Typography component="div" variant="subtitle1">
            {numSelected} Elemento{numSelected > 1 ? 's' : ''} seleccionado{numSelected > 1 ? 's' : ''}
          </Typography>
        :
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Buscar usuario"
            startAdornment={
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
      }

      {
        numSelected > 0
        ?
          <Tooltip title="Inactivar selección" placement="top" enterDelay={200} arrow>
            <IconButton onClick={handleClickOpen}>
              <Icon icon={slashOutline} />
            </IconButton>
          </Tooltip>
        :
          ''
      }

      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle>Inactivar usuario{numSelected > 1 ? 's' : ''}</DialogTitle>
        <DialogContent>
          Estas a punto de inactivar {numSelected} usuario{numSelected > 1 ? 's ' : ' '}
          ¿Estas seguro de querer inactivarlo{numSelected > 1 ? 's' : ''}?
          Esta acción se podrá revertir editando {numSelected > 1 ? 'individualmente a los usuarios' : 'el usuario'}
        </DialogContent>
        <DialogActions>
          <Button onClick={inactivateUsers}>Aceptar</Button>
          <Button variant="contained" size="medium" onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </RootStyle>
  );
}

export default UserListToolbar;
