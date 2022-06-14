import { useEffect, useState } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { FNumber } from '../../../utils/formatNumber';
import { BaseOptionChart } from '../../charts';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

const CHART_HEIGHT = 360;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

function UserDistribution() {
  const [data, setData] = useState([]);

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}users`)
      .then(Response => {
        setData(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
  });

  const loadDataStu = () => {
    var filterResults = data.filter((element) => {
      if (element.userx_type === "N") {
        return element;
      }
      return filterResults;
    });
    return filterResults;
  };

  const loadDataAdv = () => {
    var filterResults = data.filter((element) => {
      if (element.userx_type === "A") {
        return element;
      }
      return filterResults;
    });
    return filterResults;
  };

  const loadDataAdm = () => {
    var filterResults = data.filter((element) => {
      if (element.userx_type === "S") {
        return element;
      }
      return filterResults;
    });
    return filterResults;
  };

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.grey[500],
      theme.palette.info.main,
      theme.palette.warning.main,
    ],
    labels: ['Estudiantes', 'Asesores', 'Administradores'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => FNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }

    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader title="Distribución de usuarios" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={[loadDataStu().length, loadDataAdv().length, loadDataAdm().length]} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}

export default UserDistribution;