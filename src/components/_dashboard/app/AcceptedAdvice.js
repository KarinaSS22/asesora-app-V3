import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-circle-2-fill';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { FShortenNumber } from '../../../utils/formatNumber';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
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
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

function AcceptedAdvice() {
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

  const loadData = () => {
    var filterResults = data.filter((element) => {
      if (element.advise_status === "A") {
        return element;
      }
      return filterResults;
    });
    return filterResults;
  };

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={checkmarkFill} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{FShortenNumber(loadData().length)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Asesorías Aceptadas
      </Typography>
    </RootStyle>
  );
}

export default AcceptedAdvice;