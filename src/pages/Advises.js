import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card } from '@mui/material';
import Page from '../components/Page';
import { Advise } from '../components/_dashboard/advises';
import { Wrong } from '../components/_dashboard/errors';
import LoadingLayout from '../layouts/LoadingLayout';
import MockImgAvatar from '../utils/mockImages';
import { WS_PATH, NAME_APP } from '../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

function Advises() {
    const [advise, setAdvise] = useState([]);
    const [advisor, setAdvisor] = useState([]);
    const [noRequest, setNoRequest] = useState(false);
    const [procesing, setProcesing] = useState(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    var params = useParams();
    var idSubject = params.subjectID;
    var idUser = params.adviserID;

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

    const requestGetAdvisor = async () => {
        await axios.get(`${WS_PATH}advisors`)
            .then(response => {
                setAdvisor(response.data);
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
        requestGetAdvisor();
    }, []);

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const date = new Date();
    const validateDate = (adviseDateTime) => {
        var adviseDateArray = adviseDateTime.split('T');
        var adviseDate = adviseDateArray[0].split('-');
        var todayD = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        var adviseD = new Date(adviseDate[0], adviseDate[1], adviseDate[2]);
        return (adviseD > todayD)
    };

    const filterAdvises = () => {
        var data = [];
        advise.filter((element) => {
            if ((element.advise_status === 'S') && (validateDate(element.advise_date_start)) && (element.advisorStatus === 'A')) {
                if (idSubject !== undefined) {
                    if (idUser !== undefined) {
                        if (idSubject.match(element.advise_subject) && idUser.match(element.advise_advisor)) {
                            data.push(element);
                        }
                    } else if (idSubject.match(element.advise_subject)) {
                        data.push(element);
                    }

                } else {
                    data.push(element);
                }
            }
            return 0;
        });

        var uniqueArray = [...new Set(data)];
        var sortedArray = uniqueArray.sort(function (a, b) { a = new Date(a.advise_date_start); b = new Date(b.advise_date_start); return b > a ? -1 : b < a ? 1 : 0; });
        return sortedArray;
    };

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

    const loadRating = (advisorAdv) => {
        var rating = 0;
        advisor.filter((element) => {
            if (advisorAdv === element.advisor_code) {
                rating = element.advisor_rating;
            }
            return 0;
        });
        return rating;
    };

    return (
        <Page title={`Asesora${NAME_APP} | Asesorías`}>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Asesorías
                </Typography>

                <Grid container spacing={3}>
                    {
                        noRequest
                        ?
                            <Wrong />
                        :
                            filterAdvises().map(element => (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <Advise
                                            id={element.advise_code}
                                            idStudent={cookies.get('UserCode')}
                                            subject={element.subjectx_name}
                                            idAdviser={element.advise_advisor}
                                            adviser={`${element.advisorName} ${element.advisorLastName}`}
                                            image={element.advisorImage !== '' ? element.advisorImage : MockImgAvatar()}
                                            rating={loadRating(element.advise_advisor)}
                                            comments={loadComments(element.advise_advisor).length}
                                            modality={element.advise_modality}
                                            start={element.advise_date_start}
                                            end={element.advise_date_ends}
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

export default Advises;