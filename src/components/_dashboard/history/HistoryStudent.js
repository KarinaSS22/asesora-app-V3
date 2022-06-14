import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import MockImgAvatar from '../../../utils/mockImages';
import calendarFill from '@iconify/icons-eva/calendar-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import downwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import pinFill from '@iconify/icons-eva/pin-fill';
import videoFill from '@iconify/icons-eva/video-fill';
import { LoadingButton } from '@mui/lab';
import { Typography, Box, Stack, Grid, TextField, Divider, Accordion, AccordionSummary, AccordionDetails,
  Rating, Skeleton, IconButton, Alert, Snackbar } from '@mui/material';
import { WS_PATH } from '../../../Configurations';
import axios from 'axios';

function dateFormat(date) {
  var dateTimeArray = date.split('T');
  var dateArray = dateTimeArray[0].split('-');
  return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

function timeFormat(dateStart, dateEnd) {
  var dateTimeStartArray = dateStart.split('T');
  var dateTimeEndArray = dateEnd.split('T');
  var timeStartArray = dateTimeStartArray[1].split(':');
  var timeEndArray = dateTimeEndArray[1].split(':');
  return `${timeStartArray[0]}:${timeStartArray[1]} - ${timeEndArray[0]}:${timeEndArray[1]}`;
}

function HistoryStudent(props) {
  const [advise, setAdvise] = useState({ advise_code: '' });
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const requestGet = async () => {
    await axios.get(`${WS_PATH}advises/${props.id}`)
      .then(response => {
        setAdvise(response.data);
      }).catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    requestGet();
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  const peticionPutAdvise = async () => {
    await axios.put(`${WS_PATH}advises/${props.id}`, {
      advise_code: advise.advise_code,
      advise_student: advise.advise_student,
      advise_topic: advise.advise_topic,
      advise_subject: advise.advise_subject,
      advise_advisor: advise.advise_advisor,
      advise_school: advise.advise_school,
      advise_building: advise.advise_building,
      advise_classroom: advise.advise_classroom,
      advise_date_request: advise.advise_date_request,
      advise_date_start: advise.advise_date_start,
      advise_date_ends: advise.advise_date_ends,
      advise_modality: advise.advise_modality,
      advise_url: advise.advise_url,
      advise_comments: getFieldProps('comments').value,
      advise_status: advise.advise_status,
      advise_rating: rating === '' ? advise.advise_rating : rating
    })
      .then((response) => {
        ratingAdvisor(advise.advise_advisor);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ratingAdvisor = (idAdvisor) => {
    axios.get(`${WS_PATH}advises`)
      .then(response => {
        var sumRating = 0;
        var numAdvises = 0;
        response.data.filter((element) => {
          if ((element.advise_advisor === idAdvisor) && (element.advise_rating !== 0)) {
            sumRating = sumRating + element.advise_rating;
            numAdvises = numAdvises + 1;
          }
          return 0;
        });
        var avg = Math.round(sumRating / numAdvises);
        peticionPutAdvisor(idAdvisor, avg);
      }).catch(error => {
        console.log(error);
      });
  };

  const peticionPutAdvisor = (idAdvisor, ratingAvg) => {
    var UrlAdvisor = `${WS_PATH}advisors/${idAdvisor}`;
    axios.get(UrlAdvisor)
      .then(Response => {
        axios.put(UrlAdvisor, {
          advisor_code: Response.data.advisor_code,
          advisor_rating: ratingAvg,
          advisor_comments: Response.data.advisor_comments,
          advisor_status: Response.data.advisor_status,
        }).then(response => {
          setLoading(false);
          setOpen(true);
          setShowAlert(true);
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      })
  }

  const RegisterSchema = Yup.object().shape({
    comments: Yup.string()
      .required('No sea realizado ningún comentario')
      .max(200, 'Máximo 200 caracteres')
  });

  const formik = useFormik({
    initialValues: {
      comments: advise.advise_comments,
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: () => {
      setLoading(true);
      peticionPutAdvise();
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    advise.advise_code === ''
    ?
      <Skeleton variant="rectangular" height={90} />
    :
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon icon={downwardFill} width="26px" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container>
            <Grid item xs={12} sm={6} md={3.5}>
              <Box
                sx={{
                  display: 'flex',
                  width: 'fit-content',
                }}
              >
                <IconButton
                  to={`/dashboard/adviser-profile/${advise.advise_advisor}`}
                  component={RouterLink}
                  sx={{
                    padding: 0,
                    width: 70,
                    height: 70
                  }}>
                  <Box
                    component="img"
                    src={`data:image/png;base64,${advise.advisorImage !== '' ? advise.advisorImage : MockImgAvatar()}`}
                    alt="advisorImage"
                    sx={{ textAlign: 'center', width: 70, borderRadius: 8, height: 70 }}
                  />
                </IconButton>

                <Box sx={{ marginLeft: '15px' }}>
                  <Typography gutterBottom variant="h6">
                    {`${advise.advisorName} ${advise.advisorLastName}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {advise.subjectx_name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Divider orientation='vertical' variant='middle' flexItem />
            <Grid item xs={12} sm={5} md={2.5}>
              <Box sx={{ textAlign: 'center', alignItems: 'center', }}>
                <Typography gutterBottom variant="h6">
                  <Icon icon={calendarFill} width="15px" />&nbsp;Fecha
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {dateFormat(props.dateStart)}
                </Typography>
              </Box>
            </Grid>
            <Divider orientation='vertical' variant='middle' flexItem />
            <Grid item xs={12} sm={5} md={2.5}>
              <Box sx={{ textAlign: 'center', alignItems: 'center' }}>
                <Typography gutterBottom variant="h6">
                  <Icon icon={clockFill} width="15px" />&nbsp;Horario
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {timeFormat(props.dateStart, props.dateEnd)}
                </Typography>
              </Box>
            </Grid>
            <Divider orientation='vertical' variant='middle' flexItem />
            <Grid item xs={12} sm={5} md={2.5}>
              <Box sx={{ textAlign: 'center', alignItems: 'center' }}>
                <Typography gutterBottom variant="h6">
                  <Icon icon={advise.advise_modality === 'P' ? pinFill : videoFill} width="15px" />&nbsp;Lugar
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {
                    advise.advise_modality === 'V'
                    ?
                      `Código: ${advise.advise_url}`
                    :
                      `Edificio: ${advise.building_name} - ${advise.classroom_name}`
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={11} md={10}>
                  <TextField
                    fullWidth
                    label="Tema"
                    value={advise.advise_topic}
                    variant="standard"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2} >
                  <Stack style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      name="size-medium"
                      value={rating === '' ? advise.advise_rating : rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Comentario"
                    {...getFieldProps("comments")}
                    error={Boolean(touched.comments && errors.comments)}
                    helperText={touched.comments && errors.comments}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Stack style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      style={{ width: 'fit-content' }}
                      loading={loading}
                    >
                      Guardar cambios
                    </LoadingButton>
                    {
                      showAlert
                      ?
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose} sx={{ mt: 10 }}>
                          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            ¡Se guardaron los cambios con éxito!
                          </Alert>
                        </Snackbar>
                      :
                        null
                    }
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </AccordionDetails>
      </Accordion >
  );
}
export default HistoryStudent;