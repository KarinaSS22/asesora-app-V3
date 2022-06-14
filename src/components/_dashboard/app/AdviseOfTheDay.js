import { useEffect, useState } from 'react';
import { Card, Typography, CardHeader, CardContent, CardMedia, Box } from '@mui/material';
import { WS_PATH } from '../../../Configurations';
import { Timeline, TimelineItem, TimelineContent, TimelineConnector, TimelineSeparator, TimelineDot } from '@mui/lab';
import Cookies from 'universal-cookie'
import axios from 'axios';

function AdviseOfTheDay() {
  const [data, setData] = useState([]);

  const cookies = new Cookies();

  const peticionesGet = async () => {
    await axios.get(`${WS_PATH}advises`)
      .then(Response => {
        setData(Response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionesGet();
  });

  const timeFormat = (text) => {
    var hora = text.split('T');
    var cortarHora = hora[1].split(':');
    return cortarHora[0] + ":" + cortarHora[1];
  };

  const datesAreOnSameDay = (dateAdv, dateSys) => {
    if (dateAdv.getFullYear() === dateSys.getFullYear() &&
      dateAdv.getMonth() === dateSys.getMonth() &&
      dateAdv.getDate() === dateSys.getDate()) {
      return (true);
    } else {
      return (false);
    }
  };

  const filterAndSort = () => {
    var filterResults = data.filter((element) => {
      if ((cookies.get('UserType') === 'N' ? element.advise_student : element.advise_advisor) === cookies.get('UserCode')) {
        if ((element.advise_status === 'A') && ((cookies.get('UserType') === 'N' ? element.advisorStatus : element.studentStatus) === 'A')) {
          if (datesAreOnSameDay(new Date(element.advise_date_start), new Date())) {
            return element;
          }
          return 0;
        }
      }
      return 0;
    });
    var sortedArray = filterResults.sort(function (a, b) { a = new Date(a.advise_date_start); b = new Date(b.advise_date_start); return b > a ? -1 : b < a ? 1 : 0; });
    return sortedArray;
  }

  return (
    <Card sx={{ height: '420px' }} >
      <CardHeader title="Tus asesorías del día" />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '87%' }}>
        {
          filterAndSort().length === 0
          ?
            <>
              <CardMedia
                component="img"
                height="82%"
                image="/static/illustrations/illustration_day_off.png"
                alt="day off"
                sx={{ objectFit: 'contain' }}
              />
              <Typography variant="subtitle2" component="span">
                Ninguna asesoría agendada por el día de hoy
              </Typography>
            </>
          :
            <Box
              mb={2}
              display="flex"
              flexDirection="column"
              style={{
                overflow: "hidden",
                overflowY: "scroll"
              }}
            >
              <Timeline>
                {
                  filterAndSort().map(element => (
                    <TimelineItem key={element.advise_code}>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot
                          sx={{ bgcolor: (element.advise_modality === 'P' && '#7F8C98') || '#502FBC' }}
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 10 }}>
                        <Typography variant="h6" component="span">
                          {timeFormat(element.advise_date_start)}
                        </Typography>
                        <Typography>{element.subjectx_name}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                }
              </Timeline>
            </Box>
        }
      </CardContent>
    </Card>
  );
}

export default AdviseOfTheDay;