import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card } from '@mui/material';
import Page from '../components/Page';
import { Adviser } from '../components/_dashboard/advisers';
import { Wrong } from '../components/_dashboard/errors';
import LoadingLayout from '../layouts/LoadingLayout';
import MockImgAvatar from '../utils/mockImages';
import { WS_PATH, NAME_APP } from '../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

function Advisers() {
    const [advisers, setAdvisers] = useState([]);
    const [noRequest, setNoRequest] = useState(false);
    const [advise, setAdvise] = useState([]);
    const [procesing, setProcesing] = useState(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const peticionesGet = async () => {
        await axios.get(`${WS_PATH}advisors`)
            .then(Response => {
                setAdvisers(Response.data);
                setProcesing(false);
            }).catch(error => {
                if (error.request) {
                    console.log(error.request);
                    setNoRequest(true);
                }
                else {
                    console.log(error);
                }
            })
    }

    const peticionesGetAdvise = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(Response => {
                setAdvise(Response.data);
            }).catch(error => {
                if (error.request) {
                    console.log(error.request);
                    setNoRequest(true);
                }
                else {
                    console.log(error);
                }
            })
    }

    const loadComments = (advisor) => {
        var todayD = new Date();
        var filterResults = advise.filter((element) => {
            var todayA = new Date(element.advise_date_ends);
            if ((element.advise_advisor === advisor) && (element.advise_comments !== '') && (todayA < todayD) && (element.advise_status === 'A')) {
                return element;
            }
            return filterResults;
        });
        return filterResults;
    };

    useEffect(() => {
        peticionesGet();
        peticionesGetAdvise();
    }, []);

    return (
        <Page title={`Asesora${NAME_APP} | Asesores`}>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Asesores
                </Typography>

                <Grid container spacing={3}>
                    {
                        noRequest
                        ?
                            <Wrong />
                        :
                            advisers.map(elemento => (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card>
                                        <Adviser
                                            id={elemento.advisor_code}
                                            image={elemento.userx_image !== '' ? elemento.userx_image : MockImgAvatar()}
                                            name={`${elemento.userx_name} ${elemento.userx_lastname}`}
                                            email={elemento.userx_email}
                                            rating={elemento.advisor_rating}
                                            comments={loadComments(elemento.advisor_code).length}
                                        />
                                    </Card>
                                </Grid>
                            ))
                    }

                    {
                        procesing
                        ?
                            <LoadingLayout isProcesing={procesing}/>
                        :
                            null
                    }
                </Grid>
            </Container>
        </Page>
    );
}

export default Advisers;