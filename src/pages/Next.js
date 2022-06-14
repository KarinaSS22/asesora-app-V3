import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { NAME_APP } from '../Configurations';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  maxHeight: '100vh',
  alignItems: 'center',
  paddingTop: theme.spacing(15)
}));

function Next() {
  return (
    <RootStyle title={`Proximamente | Asesora${NAME_APP}`}>
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 552, margin: 'auto', textAlign: 'center' }}>
          <motion.div variants={varBounceIn}>
              <Box component="img" src="/static/illustrations/illustration-work-process.png" sx={{
                width: '35%',
                margin: 'auto',
                marginBottom: 1
              }}/>
            </motion.div>

            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph sx={{mb: 2}}>
                Proximamente, seguimos trabajando!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary', mb: 4}}>
              Lo sentimos, seguimos trabajando para incluir nuevas funcionalidades. 
              Por favor ten paciencia, muy pronto las conoceras.
            </Typography>

            <Button to="/dashboard" size="large" variant="contained" component={RouterLink}>
              Regresar al inicio
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}

export default Next;