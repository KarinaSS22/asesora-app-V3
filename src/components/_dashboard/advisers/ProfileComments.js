import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Wrong } from '../errors';
import MockImgAvatar from '../../../utils/mockImages';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

function ProfileComments(props) {
    const [data, setData] = useState([]);
    const [noRequest, setNoRequest] = useState(false);

    const peticionesGet = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(Response => {
                setData(Response.data);
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

    useEffect(() => {
        peticionesGet();
    }, []);

    const loadData = () => {
        var todayD = new Date();
        var filterResults = data.filter((element) => {
            var todayA = new Date(element.advise_date_ends);
            if ((element.advise_comments !== '') && (todayA < todayD) && (element.advise_status === 'A')) {
                if (element.advise_advisor === props.adviser) {
                    return element;
                }
            }
            return filterResults;
        });
        return filterResults;
    };


    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
                            Hola, estos son los comentarios sobre las asesorías de {props.name}
                        </Typography>

                        <List>
                            <div>
                                {
                                    noRequest
                                    ?
                                        <Wrong />
                                    :
                                        loadData().map(element => (
                                            <ListItem button key={element.advise_code}>
                                                <ListItemAvatar>
                                                    <Avatar alt={element.studentName} src={`data:image/png;base64,${element.studentImage !== '' ? element.studentImage : MockImgAvatar()}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="subtitle2"
                                                            >
                                                                {`${element.studentName} ${element.studentLastName} ${element.studentLastMotherName}`}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                {element.subjectx_name}
                                                            </Typography>
                                                            {` - ${element.advise_comments}`}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                }
                            </div>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    );
}

export default ProfileComments;