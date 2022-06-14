import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card } from '@mui/material';
import Page from '../components/Page';
import { HistoryStudent, HistoryAdvisor } from '../components/_dashboard/history';
import { Wrong } from '../components/_dashboard/errors';
import LoadingLayout from '../layouts/LoadingLayout';
import { WS_PATH, NAME_APP } from '../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

function History() {
    const [advise, setAdvise] = useState([]);
    const [noRequest, setNoRequest] = useState(false);
    const [procesing, setProcesing] = useState(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const requestGet = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(response => {
                setAdvise(response.data);
                setProcesing(false);
            }).catch(error => {
                if (error.request) {
                    console.log(error.request);
                    setNoRequest(true);
                }
                else {
                    console.log(error);
                }
            });
    }

    useEffect(() => {
        requestGet();
    }, []);

    const filterSortAdvises = () => {
        var data = [];
        var todayD = new Date();
        advise.filter((element) => {
            var todayA = new Date(element.advise_date_ends);
            if ((element.advise_status === 'A') && (todayA < todayD)) {
                if (cookies.get('UserType') === 'N') {
                    if (element.advise_student === cookies.get('UserCode')) {
                        data.push(element);
                    }
                } else if (cookies.get('UserType') === 'A') {
                    if (element.advise_advisor === cookies.get('UserCode')) {
                        data.push(element);
                    }
                }
            }
            return 0;
        });
        var sortedArray = data.sort(function (a, b) { a = new Date(a.advise_date_ends); b = new Date(b.advise_date_ends); return b < a ? -1 : b < a ? 1 : 0; });
        return sortedArray;
    };

    return (
        <Page title={`Asesora${NAME_APP} | Historial`}>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Historial
                </Typography>
                <Grid container spacing={3}>
                    {
                        noRequest
                        ?
                            <Wrong />
                        :
                            filterSortAdvises().map(element => (
                                <Grid item xs={12} sm={12} md={12}>
                                    <Card>
                                        {
                                            cookies.get('UserType') === 'N'
                                            ?
                                                <HistoryStudent
                                                    id={element.advise_code}
                                                    dateStart={element.advise_date_start}
                                                    dateEnd={element.advise_date_ends}
                                                />
                                            :
                                                <HistoryAdvisor
                                                    id={element.advise_code}
                                                    dateStart={element.advise_date_start}
                                                    dateEnd={element.advise_date_ends}
                                                />
                                        }
                                    </Card>
                                </Grid>
                            ))
                    }
                </Grid>
            </Container>

            {
                procesing
                ?
                    <LoadingLayout isProcesing={procesing}/>
                :
                    null
            }
        </Page>
    );
}

export default History;