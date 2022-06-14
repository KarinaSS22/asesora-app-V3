import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { styled } from '@mui/material/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment,
  Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';
import Slide from '@mui/material/Slide';

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

ClassroomListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ClassroomListToolbar({ numSelected, filterName, onFilterName }) {
  const[open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
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
            placeholder="Buscar salón"
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
          <Tooltip title="Borrar selección" placement="top" enterDelay={200} arrow>
            <IconButton onClick={handleClickOpen}>
              <Icon icon={trash2Fill} />
            </IconButton>
          </Tooltip>
        :
          ''
      }

      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle>Eliminar salón</DialogTitle>
        <DialogContent>
          estas a punto de eliminar {numSelected} sal{numSelected > 1 ? 'ones ' : 'ón '}
          ¿Estas seguro de querer eliminarlo{numSelected > 1 ? 's' : ''}?
          Esta acción no se podrá revertir
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Aceptar</Button>
          <Button variant="contained" size="medium" onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </RootStyle>
  );
}

export default ClassroomListToolbar;