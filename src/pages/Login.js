import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
import AuthLayout from '../layouts/AuthLayout';
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import AuthSocial from '../components/authentication/AuthSocial';
import { NAME_APP } from '../Configurations';
import Cookies from 'universal-cookie';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  maxHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

function Login() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.get('UserCode')) {
      navigate('/dashboard', { replace: true });
    }
  });

  return (
    <RootStyle title={`Asesora${NAME_APP} | Iniciar sesión`}>
      <AuthLayout>
        ¿No tienes una cuenta? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Regístrate aquí
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle> 
          <Typography variant="h3" sx={{ px: 5, mt: 12, mb: 3, alignSelf: 'flex-start' }}>
            Hola, bienvenido de nuevo
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="hi" width="80%" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Iniciar sesión
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Selecciona una opción para iniciar sesión.
            </Typography>
          </Stack>
          <AuthSocial />

          <LoginForm />

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              ¿No tienes una cuenta?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to="register">
                Regístrate aquí
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

export default Login;