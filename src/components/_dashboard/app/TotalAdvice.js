import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import clipboardFill from '@iconify/icons-eva/clipboard-fill';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { FShortenNumber } from '../../../utils/formatNumber';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

function TotalAdvice() {
  const [data, setData] = useState([]);

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}advises`)
      .then(Response => {
        setData(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
  });

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={clipboardFill} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{FShortenNumber(data.length)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total de Asesorías
      </Typography>
    </RootStyle>
  );
}

export default TotalAdvice;