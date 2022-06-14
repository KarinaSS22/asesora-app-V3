import { Link as RouterLink } from 'react-router-dom';
import { Link, Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const RootStyle = styled('div')(({theme}) => ({
    margin: '0',
    padding: '0 15px',
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: `1px ${theme.palette.grey[300]} solid`,
    [theme.breakpoints.down('sm')]: {
        padding: '15px',
        height: 'auto'
    }
}));

const ContainerStyle = styled('div')(({theme}) => ({
    width: '85%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
    }
}));

const TitleStyle = styled('div')({
    display: 'flex',
    alignItems: 'center'
});

const SectionStyle = styled('div')(({theme}) => ({
    color: '#212B36',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        marginTop: '15px'
    }
}));

function HeaderLegal(){
    return(
        <RootStyle>
            <ContainerStyle>
                <TitleStyle>
                    <Box component="img" src="/static/logo.svg" sx={{ width: 60, height: 60 }} />
                    <Typography variant="h4" sx={{ ml: 4 }}>
                        AsesoraApp Legal
                    </Typography>
                </TitleStyle>
                <SectionStyle>
                    {/* <Link underline="none" variant="subtitle2" component={RouterLink} to="/comming" sx={{ mr:3, color: '#637381' }}>
                        Ayuda
                    </Link>
                    | */}
                    <Link underline="none" variant="subtitle2" component={RouterLink} to="/register" sx={{ ml:3, mr:3 }}>
                        Registrarse
                    </Link>
                    <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
                        Inicia sesión
                    </Link>
                </SectionStyle>
            </ContainerStyle>
        </RootStyle>
    );
}

export default HeaderLegal;