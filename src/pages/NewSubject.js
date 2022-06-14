import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { sentenceCase } from 'change-case';
import { Card, Table, Stack, Button, Checkbox, TableRow, TableBody, TableCell, Container, TextField, Typography, TableContainer,
    TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Snackbar, Alert } from '@mui/material';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { Wrong } from '../components/_dashboard/errors';
import { UserListHead } from '../components/_dashboard/user';
import { SubjectListToolbar, SubjectMoreMenu } from '../components/_dashboard/subjects';
import Slide from '@mui/material/Slide';
import { WS_PATH, NAME_APP } from '../Configurations';
import axios from 'axios';
import Cookies from 'universal-cookie';

const TABLE_HEAD = [
    { id: 'subject', label: 'Materia', alignRight: false },
    { id: 'school', label: 'Escuela', alignRight: false },
    { id: 'subjectCode', label: 'Código', alignRight: false },
    { id: 'status', label: 'Estatus', alignRight: false },
    { id: '' }
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

function changeLabelStatus(text) {
    if (text === 'A') {
        return 'activo';
    } else {
        return 'inactivo';
    }
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function NewSubjects() {
    const [data, setData] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('building');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filter, setFilter] = useState('');
    const [noRequest, setNoRequest] = useState(false);
    const [open, setOpen] = useState(false);
    const [code, setSubjectCode] = useState('');
    const [subject, setSubject] = useState('');
    const [classroom, setClassroom] = useState([]);
    const [valueClassroom, setValueClassroom] = useState('');
    const [showAlertPost, setShowAlertPost] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    const requestGet = async () => {
        await axios.get(`${WS_PATH}subjects`)
            .then(response => {
                setData(response.data);
                setDataTable(response.data);
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

    const getClassroomRequest = async () => {
        await axios.get(`${WS_PATH}classrooms`)
            .then(response => {
                setClassroom(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const postSubject = async () => {
        await axios.post(`${WS_PATH}subjects`, {
            subjectx_id: 0,
            subjectx_code: code,
            subjectx_name: subject,
            subjectx_credits: 5,
            subjectx_career: 'ISCC1',
            subjectx_major: 'ISCE1',
            subjectx_classroom: valueClassroom.id,
            subjectx_status: 'A'
        })
            .then((response) => {
                setShowAlertPost(true);
                setOpenAlert(true);
                setOpen(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        requestGet();
        getClassroomRequest();
    }, []);

    useEffect(() => {
        if (!cookies.get('UserCode')) {
            navigate('/');
        }
    });

    const SUBJECTLIST = data.map((element => ({
        id: element.subjectx_id,
        subject: element.subjectx_name,
        school: 'Instituto Tecnológico de Ciudad Juárez',
        subjectCode: element.subjectx_code,
        status: changeLabelStatus(element.subjectx_status)
    })));

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = SUBJECTLIST.map((n) => n.subject);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilter = (e) => {
        setFilter(filterTable(e.target.value));
    }

    const filterTable = (filterBuilding) => {
        var filterResults = dataTable.filter((element) => {
            if (element.subjectx_code.toString().toLowerCase().includes(filterBuilding.toLowerCase())
                || element.subjectx_name.toString().toLowerCase().includes(filterBuilding.toLowerCase())
                || element.subjectx_status.toString().toLowerCase().includes(filterBuilding.toLowerCase())
                || 'Instituto Tecnológico de Ciudad Juárez'.toString().toLowerCase().includes(filterBuilding.toLowerCase())
            ) {
                return element;
            }
            return setData(filterResults);
        });
        return setData(filterResults);
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - SUBJECTLIST.length) : 0;

    const filteredUsers = applySortFilter(SUBJECTLIST, getComparator(order, orderBy), filter);

    const isUserNotFound = filteredUsers.length === 0;

    const handleClose = () => {
        setOpen(false);
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
        window.location.reload(false);
    };

    const optionsClassroom = () => {
        let data = [];
        classroom.filter((element) => {
            if (element.classroom_code !== '000') {
                data.push({ label: element.classroom_name, id: element.classroom_code });
            }
            return 0;
        });

        var uniqueArray = [...new Set(data)];

        return uniqueArray;
    };

    return (
        <Page title={`Asesora${NAME_APP} | Materias`}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Materias
                    </Typography>
                    {
                        data <= 0 && isUserNotFound
                        ?
                            null
                        :
                            <Button
                                variant="contained"
                                component={RouterLink}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                to="#"
                                startIcon={<Icon icon={plusFill} />}
                            >
                                Agregar materia
                            </Button>
                    }

                </Stack>

                {
                    noRequest
                    ?
                        <Wrong />
                    :
                        <Card>
                            <SubjectListToolbar
                                numSelected={selected.length}
                                filterName={filter}
                                onFilterName={handleFilter}
                            />

                            <Scrollbar>

                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table>
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={SUBJECTLIST.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredUsers
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => {
                                                    const { id, subject, school, subjectCode, status } = row;
                                                    const isItemSelected = selected.indexOf(subject) !== -1;

                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={id}
                                                            tabIndex={-1}
                                                            role="checkbox"
                                                            selected={isItemSelected}
                                                            aria-checked={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                    onChange={(event) => handleClick(event, subject)}
                                                                />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" padding="none">
                                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {subject}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="left">{school}</TableCell>
                                                            <TableCell align="left">{subjectCode}</TableCell>
                                                            <TableCell align="left">
                                                                <Label
                                                                    variant="ghost"
                                                                    color={(status === 'inactivo' && 'error') || 'success'}
                                                                >
                                                                    {sentenceCase(status)}
                                                                </Label>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <SubjectMoreMenu idSubject={id} name={subject} />
                                                            </TableCell>

                                                        </TableRow>
                                                    );
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        {isUserNotFound && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                        <SearchNotFound searchQuery={filter} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>

                            <TablePagination
                                rowsPerPageOptions={[25, 50, 100]}
                                component="div"
                                count={SUBJECTLIST.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Resultados por página"
                                labelDisplayedRows={({ from, to, count }) => {
                                    return `Mostrando ${from} – ${to} de ${count !== -1 ? count : `más de ${to}`}`;
                                }}
                            />
                        </Card>
                }
            </Container>

            <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}
                maxWidth={'sm'}>
                <DialogTitle>
                    Agregar materia
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ padding: '12px' }}>
                        <TextField
                            fullWidth
                            label="Código materia"
                            onChange={(event, newValue) => {
                                setSubjectCode(event.target.value);
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Nombre materia"
                            onChange={(event, newValue) => {
                                setSubject(event.target.value);
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Carrera"
                        />

                        <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-classroom"
                            onChange={(event, newValue) => {
                                setValueClassroom(newValue);
                            }}
                            options={optionsClassroom()}
                            noOptionsText={'No hay coincidencias'}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label="Salón" />}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ pb: 2, pr: 3 }}>
                    <Button variant="contained" size="medium" onClick={() => postSubject()}>Guardar</Button>
                    <Button onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>
            {
                showAlertPost
                ?
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={6000} onClose={handleAlertClose}>
                        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%', boxShadow: 10, marginTop: 10 }}>
                            Se ha registrado con éxito
                        </Alert>
                    </Snackbar>
                :
                    null
            }
        </Page>
    );
}

export default NewSubjects;
