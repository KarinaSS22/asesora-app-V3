import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { LOGO_APP } from '../Configurations';

Logo.propTypes = {
  sx: PropTypes.object
};

function Logo({ sx }) {
  return <Box component="img" src={LOGO_APP} sx={{ width: 60, height: 60, ...sx }} />;
}

export default Logo;