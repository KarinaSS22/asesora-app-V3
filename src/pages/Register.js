import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
import AuthLayout from '../layouts/AuthLayout';
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { RegisterForm } from '../components/authentication/register';
import { NAME_APP } from '../Configurations';

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

function Register() {
  return (
    <RootStyle title={`Asesora${NAME_APP} | Registrarse`}>
      <AuthLayout>
        ¿Ya tienes una cuenta? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
          Inicia sesión
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 14, mb: 0 }}>
            Buscar asesorias nunca había sido tan fácil
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_register.png" style={{width: '83%', margin: 'auto'}}/>
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Registrarse
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Regístrate gratis. No necesitas tarjeta de crédito.
            </Typography>
          </Box>

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            Al registrarte, aceptas los&nbsp;
            <Link href="/legal/end-user-agreement" target="_self" rel="noopener" underline="always" sx={{ color: 'text.primary' }}>
              Términos del servicio
            </Link>
            &nbsp;y&nbsp;
            <Link href="/legal/privacy-policy" target="_self" rel="noopener" underline="always" sx={{ color: 'text.primary' }}>
              Políticas de privacidad
            </Link>
            &nbsp;de AsesoraApp.
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              ¿Ya tienes una cuenta?&nbsp;
              <Link to="/login" component={RouterLink}>
                Inicia sesión
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

export default Register;