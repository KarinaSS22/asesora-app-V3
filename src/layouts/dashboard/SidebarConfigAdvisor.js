import { Icon } from '@iconify/react';
import gridFill from '@iconify/icons-eva/grid-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import clipBoardFill from '@iconify/icons-eva/clipboard-fill';
import calendarFill from '@iconify/icons-eva/calendar-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import infoFill from '@iconify/icons-eva/info-fill';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfigAdvisor = [
  {
    title: 'tablero',
    path: '/dashboard/app',
    icon: getIcon(gridFill)
  },
  {
    title: 'añadir asesoría',
    path: '/dashboard/new-advise',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'reportes',
    path: '/dashboard/reports',
    icon: getIcon(clipBoardFill)
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

export default sidebarConfigAdvisor;