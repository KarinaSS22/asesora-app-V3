import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Wrong } from '../errors';
import MockImgAvatar from '../../../utils/mockImages';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

function ProfileComments(props) {
    const [data, setData] = useState([]);
    const [noRequest, setNoRequest] = useState(false);
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const loadDataPositive = () => {
        var todayD = new Date();
        var filterResults = data.filter((element) => {
            var todayA = new Date(element.advise_date_ends);
            if ((element.advise_comments !== '') && (todayA < todayD) && (element.advise_status === 'A')) {
                if (element.advise_advisor === props.adviser) {
                    if (detectFeeling(element.advise_comments) === 1)
                        return element;
                }
            }
            return filterResults;
        });
        return filterResults;
    };

    const loadDataNegative = () => {
        var todayD = new Date();
        var filterResults = data.filter((element) => {
            var todayA = new Date(element.advise_date_ends);
            if ((element.advise_comments !== '') && (todayA < todayD) && (element.advise_status === 'A')) {
                if (element.advise_advisor === props.adviser) {
                    if (detectFeeling(element.advise_comments) === 0)
                        return element;
                }
            }
            return filterResults;
        });
        return filterResults;
    };

    const lorca = require('lorca-nlp');
    const detectFeeling = (comment) => {
        var doc = lorca(comment);
        var res = doc.sentiment();
        if (res >= 0) {
            return 1; //Positive
        } else {
            return 0; //Negative
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
                            Hola, estos son los comentarios sobre las asesorías de {props.name}
                        </Typography>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Positivos" value="1" />
                                        <Tab label="Negativos" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <List>
                                        <div>
                                            {
                                                noRequest
                                                    ?
                                                    <Wrong />
                                                    :
                                                    loadDataPositive().map(element => (
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
                                </TabPanel>

                                <TabPanel value="2">
                                    <List>
                                        <div>
                                            {
                                                noRequest
                                                    ?
                                                    <Wrong />
                                                    :
                                                    loadDataNegative().map(element => (
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
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    );
}

export default ProfileComments;