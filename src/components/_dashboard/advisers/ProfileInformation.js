import { Typography, Card, CardContent, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import emailFill from '@iconify/icons-eva/email-fill';
import briefcaseFill from '@iconify/icons-eva/briefcase-fill';
import startFill from '@iconify/icons-eva/star-fill';

function ProfileInformation(props) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.primary" sx={{mb: 2}}>
                            Información
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <Icon icon={emailFill} />&nbsp; {props.email}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <Icon icon={briefcaseFill} />&nbsp; Asesor en ITCJ
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <Icon icon={startFill} />&nbsp; {`${props.rating}${".0"}`}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={8} >
                <Card sx={{ minHeight: 230 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.primary" sx={{mb: 2}}>
                            Biografía
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.biografia}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    );
}

export default ProfileInformation;
