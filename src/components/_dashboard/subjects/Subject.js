import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MockImgAvatar from '../../../utils/mockImages';
import { Icon } from '@iconify/react';
import heartOutline from '@iconify/icons-eva/heart-outline';
import heartFill from '@iconify/icons-eva/heart-fill';
import bookFill from '@iconify/icons-eva/book-fill';
import pinFill from '@iconify/icons-eva/pin-fill';
import videoFill from '@iconify/icons-eva/video-fill';
import { Typography, Box, Stack, Button, Grid, IconButton, Tooltip, Avatar, AvatarGroup } from '@mui/material';
import Cookies from 'universal-cookie';

function Subject(props) {
    const [like, setLike] = useState(false);
    const cookies = new Cookies();

    const handleLike = () => {
        setLike(!like);
    }

    const filterSubject = () => {
        var data = [];
        props.advisors.filter((element) => {
            data.push(element.idAdvisor);
            return 0;
        });

        var uniqueArray = [...new Set(data)];
        return uniqueArray;
    };

    return (
        <Stack
            alignItems="center"
            spacing={0}
            sx={{ p: 2 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '55px' }}>
                <Typography gutterBottom variant="h6" sx={{ m: 0 }}>
                    {props.name}
                </Typography>
                {
                    cookies.get('UserType') === 'S'
                    ?
                        null
                    :
                        <IconButton color="error" size="small" onClick={handleLike} style={{ alignSelf: 'flex-start' }}>
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
            </div>

            <Box sx={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex' }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                        {(props.faceToFaceAdvise + props.virtualAdvise)}&nbsp;
                        <Icon icon={bookFill} />
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 2 }}>
                        {props.faceToFaceAdvise}&nbsp;
                        <Icon icon={pinFill} />
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', pl: 2 }}>
                        {props.virtualAdvise}&nbsp;
                        <Icon icon={videoFill} />
                    </Typography>
                </div>
            </Box>

            <Box sx={{ mt: 2 }}>
                <div>
                    <AvatarGroup max={5}>
                        {
                            props.advisors.map(subject => (
                                <Tooltip title={subject.name} placement="top" arrow>
                                    <IconButton
                                        to={`/dashboard/adviser-profile/${subject.idAdvisor}`}
                                        component={RouterLink}
                                        sx={{
                                            padding: 0,
                                            width: 35,
                                            height: 35
                                        }}>
                                        <Avatar
                                            alt={subject.idAdvisor}
                                            src={`data:image/png;base64,${subject.image !== '' ? subject.image : MockImgAvatar()}`}
                                        />
                                    </IconButton>
                                </Tooltip>
                            ))
                        }
                    </AvatarGroup>
                </div>
            </Box>
            <Grid container columnSpacing={0} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={12}>
                    <Button fullWidth to={`/dashboard/advises/${props.idSubject}${filterSubject().length === 1 ? '/' + filterSubject()[0] : undefined}`} component={RouterLink}>
                        ver asesorías disponibles
                    </Button>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default Subject;
