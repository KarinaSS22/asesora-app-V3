import { useEffect, useState } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, TextField, useTheme, Stack } from '@mui/material';
import { BaseOptionChart } from '../../charts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

function WebAppAdvise() {
    const [value, setValue] = useState(new Date());
    const [data, setData] = useState([]);

    const requestGet = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        requestGet();
    }, []);

    const dateFormat = (date) => {
        var dateTime = date.split('T');
        var dateX = dateTime[0].split('-');
        var month = dateX[1] - 1;
        var year = dateX[0];
        return [month, year];
    };

    const filterAdviseTotal = () => {
        var total = [];
        for (let i = 0; i <= 11; i++) {
            var filterResults = data.filter((element) => {
                if ((i === dateFormat(element.advise_date_start)[0]) && ('' + value.getFullYear() === dateFormat(element.advise_date_start)[1])) {
                    if (element.advise_status === 'A') {
                        return element;
                    }
                }
                return 0;
            });
            total[i] = filterResults.length;
        }
        return total;
    }

    const filterAdviseVirtual = () => {
        var total = [];
        for (let i = 0; i <= 11; i++) {
            var filterResults = data.filter((element) => {
                if ((i === dateFormat(element.advise_date_start)[0]) && ('' + value.getFullYear() === dateFormat(element.advise_date_start)[1])) {
                    if ((element.advise_modality === 'V') && (element.advise_status === 'A')) {
                        return element;
                    }
                }
                return 0;
            });
            total[i] = filterResults.length;
        }
        return total;
    }

    const filterAdviseFaceToFace = () => {
        var total = [];
        for (let i = 0; i <= 11; i++) {
            var filterResults = data.filter((element) => {
                if ((i === dateFormat(element.advise_date_start)[0]) && ('' + value.getFullYear() === dateFormat(element.advise_date_start)[1])) {
                    if ((element.advise_modality) === 'P' && (element.advise_status === 'A')) {
                        return element;
                    }
                }
                return 0;
            });
            total[i] = filterResults.length;
        }
        return total;
    }

    const CHART_DATA = [
        {
            name: 'Total',
            type: 'area',
            data: filterAdviseTotal()
        },
        {
            name: 'Virtuales',
            type: 'column',
            data: filterAdviseVirtual()
        },
        {
            name: 'Presenciales',
            type: 'line',
            data: filterAdviseFaceToFace()
        }
    ];

    const theme = useTheme();
    const chartOptions = merge(BaseOptionChart(), {
        colors: [
            theme.palette.primary.main,
            theme.palette.virtual.main,
            '#8894A1',
        ],
        stroke: { width: [0, 2, 3] },
        plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
        fill: { type: ['gradient', 'solid', 'solid'] },
        labels: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ],
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(0)} asesorías`;
                    }
                    return y;
                }
            }
        }
    });

    return (
        <Card>
            <CardHeader title="Asesorías impartidas" subheader="Cantidad de asesorías impartidas por mes" />
            <div style={{ position: 'absolute', right: '4%', top: '6%', width: '120px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                        <DatePicker
                            views={['year']}
                            label="Año"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </Stack>
                </LocalizationProvider>
            </div>
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={330} />
            </Box>
        </Card>
    );
}
export default WebAppAdvise;