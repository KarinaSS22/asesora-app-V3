import { Button, Container, Typography } from '@mui/material';

function Wrong() {
  return (
    <Container sx={{textAlign: 'center', mt: 3}}>
      <img src="/static/illustrations/illustration_someting_went_wrong.png" alt="someting went wrong" width="10%" style={{margin: 'auto', marginBottom: '24px'}} />
      <Typography variant="h5" gutterBottom sx={{mb: 1}}>
        Oh no! algo salió mal
      </Typography>
      <Typography variant="body" sx={{display: 'block', mb: 2}}>
        Algo ha salió mal, por favor vuelve a intentarlo en un momento
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload(false)}
      >
        Actualizar
      </Button>

    </Container>
  );
}

export default Wrong;