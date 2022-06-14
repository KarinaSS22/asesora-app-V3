import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar, esES } from '@mui/x-data-grid';
import { Stack, Container, Typography, Card } from '@mui/material';
import Page from '../components/Page';
import Label from '../components/Label';
import { sentenceCase } from 'change-case';
import LoadingLayout from '../layouts/LoadingLayout';
import { WS_PATH, NAME_APP } from '../Configurations';
import Cookies from 'universal-cookie';
import axios from 'axios';

function changeLabelModality(text) {
    if (text === 'P') {
        return sentenceCase('presencial');
    }
    else {
        return sentenceCase('virtual');
    }
}

function changeLabelStatus(text) {
    if (text === 'A') {
        return sentenceCase('aceptada');
    } else if (text === 'C') {
        return sentenceCase('cancelada');
    } else {
        return sentenceCase('Publicada');
    }
}

function dateTimeFormat(date) {
    var dateTimeArray = date.split('T');
    var dateArray = dateTimeArray[0].split('-');
    var timeArray = dateTimeArray[1].split(':');
    return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]} ${timeArray[0]}:${timeArray[1]}`;
}

function showDateTime(text) {
    var dateTimeArray = text.split(" ");
    var dateArray = dateTimeArray[0].split("/");
    return `${dateArray[1]}/${dateArray[0]}/${dateArray[2]} ${dateTimeArray[1]}`;
}

function Reports() {
    const [data, setData] = useState([]);
    const [procesing, setProcesing] = useState(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const columns = [
        { field: 'adviseStudent', headerName: 'Estudiante', width: 80 },
        { field: 'studentName', headerName: 'Nombre del estudiante', width: 300 },
        { field: 'studentEmail', headerName: 'Correo del estudiante', width: 200 },
        { field: 'studentPhone', headerName: 'Teléfono', width: 100 },
        { field: 'adviseTopic', headerName: 'Tema', width: 250 },
        { field: 'subjectName', headerName: 'Materia', width: 250 },
        { field: 'adviseAdvisor', headerName: 'Asesor', width: 80 },
        { field: 'advisorName', headerName: 'Nombre del asesor', width: 300 },
        { field: 'advisorEmail', headerName: 'Correo del asesor', width: 200 },
        { field: 'advisorPhone', headerName: 'Teléfono', width: 80 },
        { field: 'counselingLocationInfo', headerName: 'Lugar', width: 300 },
        {
            field: 'adviseDateRequest', headerName: 'Fecha de solicitud', width: 160, type: 'dateTime',
            renderCell: (params) => {
                return (
                    <>
                        <Typography variant="body2" gutterBottom>
                            {showDateTime(params.value)}
                        </Typography>
                    </>
                );
            }
        },
        {
            field: 'adviseDateStart', headerName: 'Fecha de inicio', width: 160, type: 'dateTime',
            renderCell: (params) => {
                return (
                    <>
                        <Typography variant="body2" gutterBottom>
                            {showDateTime(params.value)}
                        </Typography>
                    </>
                );
            }
        },
        {
            field: 'adviseDateEnds', headerName: 'Fecha de término', width: 160, type: 'dateTime',
            renderCell: (params) => {
                return (
                    <>
                        <Typography variant="body2" gutterBottom>
                            {showDateTime(params.value)}
                        </Typography>
                    </>
                );
            }
        },
        {
            field: 'adviseModality', headerName: 'Modalidad', width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <Label
                            variant="ghost"
                            color={(params.value === 'Virtual' && 'virtual') || 'default'}
                        >
                            {sentenceCase(params.value)}
                        </Label>
                    </>
                );
            }
        },
        {
            field: 'adviseStatus', headerName: 'Estado', width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Label
                            variant="ghost"
                            color={(params.value === 'Aceptada' && 'info') || (params.value === 'Publicada' && 'warning')
                                || 'error'}
                        >
                            {sentenceCase(params.value)}
                        </Label>
                    </>
                );
            }
        },
        { field: 'adviseComments', headerName: 'Comentarios', width: 450 }
    ];

    const requestGet = async () => {
        await axios.get(`${WS_PATH}advises`)
            .then(response => {
                setData(response.data);
                setProcesing(false);
            }).catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        requestGet();
    }, []);

    const filterData = () => {
        var dataAux = [];
        data.filter((element) => {
            if (cookies.get('UserType') === 'A') {
                if (element.advise_advisor === cookies.get('UserCode')) {
                    dataAux.push(element);
                }
            } else if (cookies.get('UserType') === 'S') {
                dataAux.push(element);
            }
            return 0;
        });
        var sortedArray = dataAux.sort(function (a, b) { a = new Date(a.advise_date_ends); b = new Date(b.advise_date_ends); return b < a ? -1 : b < a ? 1 : 0; });
        return sortedArray;
    };


    const adviseList = filterData().map((element => ({
        id: element.advise_code,
        adviseStudent: element.advise_student === 'l00000000' ? '---------' : element.advise_student,
        studentName: `${element.studentName} ${element.studentLastName} ${element.studentLastMotherName}`,
        studentEmail: element.studentEmail === 'l00000000@itcj.edu.mx' ? '---------@itcj.edu.mx' : element.studentEmail,
        studentPhone: element.studentPhone,
        adviseTopic: element.advise_topic,
        subjectName: element.subjectx_name,
        adviseAdvisor: element.advise_advisor,
        advisorName: `${element.advisorName} ${element.advisorLastName} ${element.advisorLastMotherName}`,
        advisorEmail: element.advisorEmail,
        advisorPhone: element.advisorPhone,
        counselingLocationInfo:
            element.advise_modality === 'V'
            ?
                element.advise_url
            :
                `Edificio: ${element.building_name} - ${element.classroom_name}`,
        adviseDateRequest: dateTimeFormat(element.advise_date_request),
        adviseDateStart: dateTimeFormat(element.advise_date_start),
        adviseDateEnds: dateTimeFormat(element.advise_date_ends),
        adviseModality: changeLabelModality(element.advise_modality),
        adviseComments: element.advise_comments,
        adviseStatus: changeLabelStatus(element.advise_status),
        studentImage: element.studentImage,
        advisorImage: element.advisorImage
    })));

    return (
        <Page title={`Asesora${NAME_APP} | Asesorías`}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Asesorías
                    </Typography>
                </Stack>
                <Card style={{ height: 472, padding: '24px' }}>
                    <div style={{ height: '100%' }}>
                        <DataGrid
                            rows={adviseList}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            componentsProps={{ toolbar: { csvOptions: { utf8WithBom: true } } }}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        studentName: false,
                                        studentEmail: false,
                                        studentPhone: false,
                                        advisorName: false,
                                        advisorEmail: false,
                                        advisorPhone: false,
                                        counselingLocationInfo: false,
                                        adviseDateEnds: false,
                                        adviseDateRequest: false,
                                        adviseComments: false,
                                        studentImage: false,
                                        advisorImage: false,
                                    },
                                },
                            }}
                            disableSelectionOnClick
                        />
                    </div>
                </Card>
            </Container>

            {
                procesing
                ?
                    <LoadingLayout isProcesing={procesing}/>
                :
                    null
            }
        </Page >
    );
}
export default Reports;