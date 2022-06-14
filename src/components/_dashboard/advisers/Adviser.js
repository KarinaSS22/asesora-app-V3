import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import startFill from '@iconify/icons-eva/star-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import heartOutline from '@iconify/icons-eva/heart-outline';
import heartFill from '@iconify/icons-eva/heart-fill';
import { Typography, Box, Stack, Button, Grid, IconButton, Tooltip } from '@mui/material';
import Cookies from 'universal-cookie';

function Adviser(props) {
    const [like, setLike] = useState(false);
    const cookies = new Cookies();

    const handleLike = () => {
        setLike(!like);
    }

    return (
        <Stack
            alignItems="center"
            spacing={0}
            sx={{ p: 2 }}
        >
            {
                cookies.get('UserType') === 'S'
                ?
                    null
                :
                    <IconButton color="error" size="small" onClick={handleLike} style={{ alignSelf: 'flex-end' }}>
                        {
                            like
                            ?
                                <Tooltip title="Quitar de favoritos" placement="top" arrow>
                                    <Icon icon={heartFill} width="32px" />
                                </Tooltip>

                            :
                                <Tooltip title="Añadir a favoritos" placement="top" arrow>
                                    <Icon icon={heartOutline} width="32px" />
                                </Tooltip>
                        }
                    </IconButton>
            }
            <Box
                component="img"
                src={`data:image/png;base64,${props.image}`}
                alt="avatar_1"
                sx={{ width: 80, borderRadius: 8, mb: 3, height: 80 }}
            />

            <Box sx={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h6">
                    {props.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {props.email}
                </Typography>
                <div style={{ display: 'inline-flex' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                        {props.rating}&nbsp;
                        <Icon icon={startFill} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 2 }}>
                        {props.comments}&nbsp;
                        <Icon icon={messageCircleFill} />
                    </Typography>
                </div>
            </Box>

            <Grid container columnSpacing={0} sx={{ mt: 3 }}>
                <Grid item xs={6} sm={6}>
                    <Button fullWidth to={`/dashboard/adviser-profile/${props.id}`} component={RouterLink}>
                        ver perfil
                    </Button>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Button fullWidth to={`/dashboard/subject/${props.id}`} component={RouterLink}>
                        agendar
                    </Button>
                </Grid>
            </Grid>
        </Stack>

    );
}
export default Adviser;
