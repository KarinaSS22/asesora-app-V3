import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import Cookies from 'universal-cookie';

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

function SearchNotFound({ searchQuery = '', ...other }) {
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.get('UserCode')) {
      navigate('/');
    }
  });

  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No existen coincidencias
      </Typography>
      <Typography variant="body2" align="center">
        No se encontraron coincidencias para &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Revisa la ortografía o utiliza palabras completas.
      </Typography>
    </Paper>
  );
}

export default SearchNotFound;