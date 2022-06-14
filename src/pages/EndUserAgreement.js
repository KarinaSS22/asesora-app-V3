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

function EndUserAgreement() {
    return (
        <Page title={`Asesora${NAME_APP} | Términos y condiciones del servicio`}>
            <HeaderLegal />
            <SectionStyle>
                <LinkStyle underline="none" variant="subtitle2" component={RouterLink} to="/legal/end-user-agreement" sx={{
                    background: '#BFE8E1'
                }}>
                    Términos y condiciones del servicio
                </LinkStyle>
                <LinkStyle underline="none" variant="subtitle2" component={RouterLink} to="/legal/privacy-policy" sx={{
                    ml: 3,
                    '&:hover': {
                        background: '#BFE8E1'
                    }
                }}>
                    Políticas de privacidad
                </LinkStyle>
            </SectionStyle>
            <ContentStyle>
                <Typography variant="h4">
                    TÉRMINOS Y CONDICIONES
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    Este contrato describe los términos y condiciones generales (en adelante, únicamente "términos y condiciones")
                    aplicables al uso de los contenidos y servicios ofrecidos a través de la aplicación web AsesoraApp (en adelante,
                    "aplicación web"), del cual es titular AsesoraApp (en adelante, "titular"). Cualquier persona que desee acceder o
                    hacer uso de la aplicación web o los servicios que en ella se ofrecen, podrá hacerlo sujetándose a los presentes
                    términos y condiciones, así como a políticas y principios incorporados al presente documento. En todo caso,
                    cualquier persona que no acepte los presentes términos y condiciones, deberá abstenerse de utilizar la aplicación
                    web y/o adquirir los servicios que en su caso sean ofrecidos.
                </Typography>
                <Typography variant="h6" mt={3}>
                    I. Del objeto
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    El objeto de los presentes términos y condiciones es regular el acceso y la utilización de la aplicación web,
                    entendiendo por este cualquier tipo de contenido o servicio que se encuentre a disposición del público en general
                    dentro del dominio de la aplicación web.
                    <br></br>
                    <br></br>
                    El titular se reserva la facultad de modificar, en cualquier momento y sin previo aviso, la presentación, los
                    contenidos, la funcionalidad, los servicios, y la configuración que pudiera estar contenida en la aplicación web;
                    en este sentido, el usuario reconoce y acepta que AsesoraApp en cualquier momento podrá interrumpir, desactivar o
                    cancelar quiera de los elementos que conforman la aplicación web o el acceso a la misma.
                    <br></br>
                    <br></br>
                    El acceso a la aplicación web por parte del usuario tiene carácter libre y, por regla general, es gratuito sin que
                    el usuario tenga que proporcionar una contraprestación para disfrutar de ello, salvo en lo referente al costo de la
                    conexión a internet suministrada por el proveedor de este tipo de servicios que hubiere contratado el mismo usuario.
                    <br></br>
                    <br></br>
                    El acceso a los contenidos y servicios de la aplicación web podrá realizarse con un registro previo del usuario.
                    <br></br>
                    <br></br>
                    La aplicación web se encuentra dirigida a los estudiantes del Instituto Tecnológico de Ciudad Juárez, sin importar
                    el semestre que cursen.
                    <br></br>
                    <br></br>
                    La aplicación web está dirigida principalmente a usuarios residentes en la República Mexicana, por lo cual, AsesoraApp
                    no asegura que la aplicación web cumpla total o parcialmente con la legislación de otros países, de forma que, si el
                    usuario reside o tiene domicilio establecido en otro país y decide acceder o utilizar la aplicación web lo hará bajo
                    su propia responsabilidad y deberá asegurarse de que tal acceso y navegación cumple con la legislación local que le
                    es aplicables, no asumiendo AsesoraApp ninguna responsabilidad que se puede derivar de dicho acto.
                    <br></br>
                    <br></br>
                    Se hace del conocimiento del usuario que el titular podrá administrar o gestionar la aplicación web de manera directa
                    o a través de un tercero, lo cual no modifica en ningún sentido lo establecido en los presentes términos y condiciones.
                </Typography>

                <Typography variant="h6" mt={3}>
                    II. Del usuario
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    El acceso o utilización de la aplicación web, así como de los recursos habilitados para interactuar entre los
                    usuarios, o entre el usuario y el titular, tales como medios para realizar publicaciones o comentarios, confiere
                    la condición de usuario de la aplicación web, por lo que quedará sujeto a los presentes términos y condiciones,
                    así como a sus siguientes modificaciones, sin perjuicio de la aplicación de la legislación aplicable, por tanto,
                    se tendrán por aceptados desde el momento en el que se accede a la aplicación web. Dada la relevancia de lo anterior,
                    se recomienda al usuario revisar las actualizaciones que se hagan a los presentes términos y condiciones.
                    <br></br>
                    <br></br>
                    Así mismo, el usuario se compromete a proporcionar información lícita y veraz en los formularios habilitados en la
                    aplicación web, en los cuales el usuario tenga que proporcionar ciertos datos o información para el acceso a algún
                    contenido o servicio ofrecido por la propia aplicación web. En todo caso, el usuario notificará de forma inmediata
                    al titular acerca de cualquier hecho que permita suponer el uso indebido de la información registrada en dichos
                    formularios, tales como, robo, extravío, o acceso no autorizado a cuentas y/o contraseñas, con el fin de proceder
                    a su inmediata cancelación.
                    <br></br>
                    <br></br>
                    AsesoraApp se reserva el derecho de retirar todos aquellos comentarios y aportaciones que vulneren la ley, el respeto
                    a la dignidad de la persona, que sean discriminatorios, atenten contra los derechos de tercero o el orden público,
                    o bien, que a su juicio no resulten adecuados para su publicación.
                    <br></br>
                    <br></br>
                    En cualquier caso, AsesoraApp no será responsable de las opiniones vertidas por los usuarios a través de comentarios
                    o publicaciones que estos realicen.
                    <br></br>
                    <br></br>
                    El solo acceso a la aplicación web no supone el establecimiento de ningún tipo de relación entre el titular y el
                    usuario.
                </Typography>

                <Typography variant="h6" mt={3}>
                    III. Del acceso y navegación en la aplicación web
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    El titular no garantiza de ningún modo la continuidad y disponibilidad de los contenidos o servicios ofrecidos
                    a través de la aplicación web, no obstante, el titular llevará a cabo las acciones que de acuerdo a sus
                    posibilidades le permitan mantener el buen funcionamiento de la aplicación web, sin que esto suponga alguna
                    responsabilidad de parte de AsesoraApp.
                    <br></br>
                    <br></br>
                    De igual forma, AsesoraApp no será responsable ni garantiza que el contenido o software al que pueda accederse a
                    través de la aplicación web, se encuentre libre de errores, software malicioso, o que pueda causar algún daño en
                    el ámbito de software o hardware en el equipo a través del cual el usuario accede.
                    <br></br>
                    <br></br>
                    El titular tampoco se hace responsable de los daños que pudiesen ocasionarse por un uso inadecuado de la aplicación
                    web. En ningún caso AsesoraApp será responsable por las pérdidas, daños o perjuicios de cualquier tipo que surjan por
                    el solo acceso o utilización de la aplicación web.
                </Typography>
                <Typography variant="h6" mt={3}>
                    IV. Política de enlaces
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    La aplicación web puede contener enlaces, contenidos, servicios o funciones, de otros sitios de internet
                    pertenecientes y/o gestionados por terceros, como por ejemplo imágenes, videos, comentarios, motores de búsqueda, etc.
                    <br></br>
                    <br></br>
                    La utilización de estos enlaces, contenidos, servicios o funciones, tiene por objeto mejorar la experiencia del
                    usuario al hacer uso de la aplicación web, sin que pueda considerarse una sugerencia, recomendación o invitación
                    para hacer uso de sitios externos. AsesoraApp en ningún caso revisará o controlará el contenido de los sitios externos,
                    de igual forma, no hace propios los productos, servicios, contenidos, y cualquier otro material existente en los
                    referidos sitios enlazados; por lo cual, tampoco se garantizará la disponibilidad, exactitud, veracidad, validez o
                    legalidad de los sitios externos a los que se pueda tener acceso a través de la aplicación web. Así mismo, el
                    titular no asume ninguna responsabilidad por los daños y perjuicios que pudieran producirse por el acceso o empleo,
                    de los contenidos, productos o servicios disponibles en los sitios web no gestionados.
                </Typography>
                <Typography variant="h6" mt={3}>
                    V. Política en materia de propiedad intelectual
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    AsesoraApp por sí o como parte cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de
                    la aplicación web, entendiendo por este el código fuente que hace posible su funcionamiento, así como las imágenes,
                    archivos de audio o video, logotipos, marcas, combinaciones de colores, estructuras, diseños y demás elementos que
                    lo distinguen. Serán, por consiguiente, protegidas por la legislación mexicana en materia de propiedad intelectual
                    e industrial, así como por los tratados internacionales aplicables. Por consiguiente, queda expresamente prohibida
                    la reproducción, distribución, o difusión de los contenidos de la aplicación web, con fines comerciales, en cualquier
                    soporte y por cualquier medio, sin la autorización de AsesoraApp.
                    <br></br>
                    <br></br>
                    El usuario se compromete a respetar los derechos de propiedad intelectual e industrial del titular. No obstante,
                    además de poder visualizar los elementos de  la aplicación web, podrá imprimirlos, copiarlos o almacenarlos,
                    siempre y cuando sea exclusivamente para su uso estrictamente personal.
                    <br></br>
                    <br></br>
                    Por otro lado, el usuario, se abstendrá de suprimir, alterar, o manipular cualquier elemento, archivo, o contenido,
                    de la aplicación web, y por ningún motivo realizará actos tendientes a vulnerar la seguridad, los archivos o bases
                    de datos que se encuentren protegidos, ya sea a través de un acceso restringido mediante un usuario y contraseña, o
                    porque no cuente con los permisos para visualizarlos, editarlos o manipularlos.
                    <br></br>
                    <br></br>
                    En caso de que el usuario o algún tercero consideren que cualquiera de los contenidos de la aplicación web suponga
                    una violación de los derechos de protección de la propiedad industrial o intelectual, deberá comunicarlo
                    inmediatamente a AsesoraApp a través del siguiente correo electrónico: asesoraapp.soporte@gmail.com
                </Typography>

                <Typography variant="h6" mt={3}>
                    VI. Legislación y jurisdicción aplicable
                </Typography>
                <Typography variant="body1" align="justify" mt={1}>
                    AsesoraApp se reserva la facultad de presentar las acciones civiles o penales que considere necesarias por la
                    utilización indebida de la aplicación web, sus contenidos, servicios, o por el incumplimiento de los presentes
                    términos y condiciones.
                    <br></br>
                    <br></br>
                    La relación entre el usuario y AsesoraApp se regirá por la legislación vigente en México, específicamente en
                    Chihuahua. De surgir cualquier controversia con relación a la interpretación y/o a la aplicación de los presentes
                    términos y condiciones, las partes se someterán a la jurisdicción ordinaria de los tribunales que correspondan
                    conforme a derecho en el estado al que se hace referencia.
                </Typography>

                <Typography variant="body2" align="center" display="block" mt={8} mb={3}>
                    © 2022 AsesoraApp
                </Typography>
                <br></br>
            </ContentStyle>
        </Page>
    );
}

export default EndUserAgreement;