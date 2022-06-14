import { Icon } from '@iconify/react';
import gridFill from '@iconify/icons-eva/grid-fill';
import personDoneFill from '@iconify/icons-eva/person-done-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import bookFill from '@iconify/icons-eva/book-fill';
import calendarFill from '@iconify/icons-eva/calendar-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import infoFill from '@iconify/icons-eva/info-fill';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfigStudents = [
  {
    title: 'tablero',
    path: '/dashboard/app',
    icon: getIcon(gridFill)
  },
  {
    title: 'asesores',
    path: '/dashboard/adviser',
    icon: getIcon(personDoneFill)
  },
  {
    title: 'materias',
    path: '/dashboard/subject',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'asesorias',
    path: '/dashboard/advises',
    icon: getIcon(bookFill)
  },
  {
    title: 'Calendario',
    path: '/dashboard/calendar',
    icon: getIcon(calendarFill)
  },
  {
    title: 'Historial',
    path: '/dashboard/history',
    icon: getIcon(clockFill)
  },
  {
    title: 'acerca de',
    path: '/comming',
    icon: getIcon(infoFill)
  }
];

export default sidebarConfigStudents;