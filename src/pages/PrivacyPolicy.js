import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Typography } from '@mui/material';
import HeaderLegal from '../components/HeaderLegal';
import Page from '../components/Page';
import { NAME_APP } from '../Configurations';

const SectionStyle = styled('div')(({ theme }) => ({
  margin: '30px auto',
  width: '85%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '85px',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
}));

const LinkStyle = styled(Link)({
  color: '#212B36',
  padding: '5px 10px',
  borderRadius: '12px'
});

const ContentStyle = styled('div')({
  width: '85%',
  margin: '0 auto',
  paddingTop: '30px',
});

function PrivacyPolicy() {
  return (
    <Page title={`Asesora${NAME_APP} | Políticas de privacidad`}>
      <HeaderLegal />
      <SectionStyle>
        <LinkStyle underline="none" variant="subtitle2" component={RouterLink} to="/legal/end-user-agreement" sx={{
          '&:hover': {
            background: '#BFE8E1'
          }
        }}>
          Términos y condiciones del servicio
        </LinkStyle>
        <LinkStyle underline="none" variant="subtitle2" component={RouterLink} to="/legal/privacy-policy" sx={{
          background: '#BFE8E1',
          ml: 3
        }}>
          Políticas de privacidad
        </LinkStyle>
      </SectionStyle>
      <ContentStyle>
        <Typography variant="h4">
          POLÍTICA DE PRIVACIDAD
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          La presente política de privacidad estable los términos en que AsesoraApp usa
          y protege la información que es proporcionada por sus usuarios al momento de
          utilizar su aplicación web. Esta compañía está comprometida con la seguridad de
          los datos de sus usuarios. Cuando le pedimos llenar los campos de información
          personal con la cual usted puede ser identificado, lo hacemos asegurando que
          solo se empleará de acuerdo a los términos establecidos. Sin embargo, esta
          política de privacidad puede cambiar con el tiempo o ser actualizada, por lo
          que le recomendamos y enfatizamos revisar continuamente esta página para
          asegurarse que está de acuerdo con dichos cambios.
        </Typography>
        <Typography variant="h6" mt={3}>
          Información que es recogida
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Esta aplicación web podrá recoger información personal, por ejemplo: Nombre e
          información de contacto así como su dirección de correo electrónico; así mismo,
          cuando sea necesario, podrá ser requerida información específica para procesar
          alguna cita de asesoría académica o realizar configuraciones personalizadas.
        </Typography>
        <Typography variant="h6" mt={3}>
          Uso de la información recogida
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Esta aplicación web emplea la información con el fin de proporcionar el mejor
          servicio posible, particularmente para mantener un registro de usuarios, de citas
          agendadas, y mejorar nuestros servicios. Es posible que sean enviados correos electrónicos
          a través de nuestro sitio con avisos importantes, nuevas funciones y otra información
          publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio,
          estos correos electrónicos serán enviados a la dirección electrónica que usted proporcione y podrán ser
          cancelados en cualquier momento. AsesoraApp está altamente comprometida para cumplir con el
          acuerdo de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos
          constantemente para asegurarnos que no exista ningún acceso no autorizado.
        </Typography>
        <Typography variant="h6" mt={3}>
          Cookies
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para
          almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve para
          obtener información respecto al tráfico web, también facilita las futuras visitas a una web
          recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerlo
          individualmente y, por lo tanto, brindarle el mejor servicio personalizado de su web.
          <br></br>
          <br></br>
          Se emplean tres cookies en este sitio:
          <br></br>
          <br></br>
          <ol style={{paddingLeft: '32px'}}>
            <li>
              UserCode: Es una cookie esencial para el inicio de sesión, usted debe permitir esta cookie en
              su navegador para proporcionar continuidad y mantener su ingreso de una página a otra. Cuando usted
              cierra sesión en la aplicación web, esta cookie es destruida.
            </li>
            <br></br>
            <li>
              UserType: Es una cookie esencial para el inicio de sesión, usted debe permitir esta cookie en
              su navegador para proporcionarle el contenido adecuado dependiendo el rol que ocupa dentro de la aplicación
              web (estudiante, asesor, administrador). Cuando usted cierra sesión, esta cookie es destruida.
            </li>
            <br></br>
            <li>
              UserEmail: Es una cookie opcional, su función es recordar su correo electrónico dentro del
              navegador, esto significa que cuando regrese al sitio, el campo "Correo electrónico" en el inicio de
              sesión estará previamente llenado para usted, esto solo si inicio sesión por medio de un correo y
              contraseña. Es seguro rechazar esta cookie, el rechazar esta cookie hará que tenga que volver a escribir su correo electrónico
              cada vez que inicie sesión.
            </li>
            <br></br>
          </ol>
          Usted puede aceptar o negar el uso de cookies, sin embargo, la mayoría de navegadores aceptan cookies automáticamente
          pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar
          las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.
        </Typography>
        <Typography variant="h6" mt={3}>
          Secreto y seguridad de los datos personales
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          AsesoraApp se compromete a adoptar las medidas técnicas y organizativas necesarias, según el nivel de seguridad adecuado
          al riesgo de los datos recogidos, de forma que se garantice la seguridad de los datos de carácter personal y se evite la
          destrucción, pérdida, alteración accidental o ilícita de datos personales transmitidos, conservados o tratados de otra
          forma, y la comunicación o acceso no autorizados a dichos datos.
          <br></br>
          <br></br>
          Debido a que AsesoraApp no puede garantizar la completa seguridad de internet ni la ausencia total de hackers
          u otros que accedan de modo fraudulento a los datos personales, el responsable del tratamiento se compromete a comunicar al
          usuario sin demora indebida cuando ocurra una violación de la seguridad de los datos personales que sea probable que entrañe
          un alto riesgo para los derechos y libertades de las personas físicas; siguiendo lo establecido en el artículo 4 del RGPD, se
          entiende por violación de la seguridad de los datos personales toda violación de la seguridad que ocasione la destrucción,
          pérdida o alteración accidental o ilícita de datos personales transmitidos, conservados o tratados de otra manera, o la
          comunicación o acceso no autorizados a dichos datos.
          <br></br>
          <br></br>
          Los datos personales serán tratados como confidenciales por el responsable del tratamiento, quien se compromete a informar
          y a garantizar por medio de una obligación legal o contractual que dicha confidencialidad sea respetada por sus empleados,
          asociados, y toda persona a la cual le haga accesible la información.
        </Typography>

        <Typography variant="h6" mt={3}>
          Seguridad de la información
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Aseguramos la información que proporcione en servidores informáticos en un entorno controlado y seguro, protegido del acceso,
          uso o divulgación no autorizados. Mantenemos medidas de seguridad administrativas, técnicas y físicas razonables para proteger
          contra el acceso no autorizado, el uso, la modificación y la divulgación de datos personales bajo su control y custodia, sin
          embargo, no se puede garantizar la transmisión de datos a través de Internet o redes inalámbricas.
        </Typography>
        <Typography variant="h6" mt={3}>
          Enlaces a terceros
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Esta aplicación web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos
          enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y, por lo tanto, no somos
          responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están
          sujetos a sus propias políticas de privacidad, por lo cual es recomendable que las consulte para confirmar que usted está de
          acuerdo con estas.
        </Typography>
        <Typography variant="h6" mt={3}>
          Control de su información personal
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestra
          aplicación web. AsesoraApp no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo
          que sea requerido por un juez con un orden judicial. AsesoraApp se reserva el derecho de cambiar los términos de la presente
          política de privacidad en cualquier momento.
        </Typography>
        <Typography variant="h6" mt={3}>
          Aceptación y cambios en esta política de privacidad
        </Typography>
        <Typography variant="body1" align="justify" mt={1}>
          Es necesario que el usuario haya leído y esté conforme con las condiciones sobre la protección de datos de carácter personal
          contenidas en esta política de privacidad, así como que acepte el tratamiento de sus datos personales para que el responsable
          del tratamiento pueda proceder al mismo en la forma, durante los plazos y para las finalidades indicadas. El uso de la
          aplicación web implicará la aceptación de la política de privacidad.
          <br></br>
          <br></br>
          AsesoraApp se reserva el derecho a modificar su política de privacidad, de acuerdo a su propio criterio, o motivado por un
          cambio legislativo, jurisprudencial o doctrinal de la Agencia Española de Protección de Datos. Los cambios o actualizaciones
          de esta política de privacidad no serán notificados de manera explícita al usuario. Se recomienda al usuario consultar esta
          página de modo frecuente para estar al tanto de los últimos cambios o actualizaciones.
        </Typography>
        <Typography variant="body2" align="center" mt={8}>
          Última actualización de aviso de privacidad: 01/05/2022
        </Typography>
        <Typography variant="body2" align="center" display="block" mt={3} mb={3}>
          © 2022 AsesoraApp
        </Typography>
        <br></br>
      </ContentStyle>
    </Page>
  );
}

export default PrivacyPolicy;