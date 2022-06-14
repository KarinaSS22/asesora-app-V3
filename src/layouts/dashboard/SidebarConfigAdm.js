import { Icon } from '@iconify/react';
import gridFill from '@iconify/icons-eva/grid-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import personDoneFill from '@iconify/icons-eva/person-done-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import clipBoardFill from '@iconify/icons-eva/clipboard-fill';
import infoFill from '@iconify/icons-eva/info-fill';
import fileAddFill from '@iconify/icons-eva/file-add-fill';
import pinFill from '@iconify/icons-eva/pin-fill';
import EditFill from '@iconify/icons-eva/edit-fill';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfigAdm = [
  {
    title: 'tablero',
    path: '/dashboard/app',
    icon: getIcon(gridFill)
  },
  {
    title: 'usuarios',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
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
    title: 'añadir materia',
    path: '/dashboard/new-subject',
    icon: getIcon(fileAddFill)
  },
  {
    title: 'edificios',
    path: '/dashboard/buildings',
    icon: getIcon(pinFill)
  },
  {
    title: 'salones',
    path: '/dashboard/classrooms',
    icon: getIcon(EditFill)
  },
  {
    title: 'reportes',
    path: '/dashboard/reports',
    icon: getIcon(clipBoardFill)
  },
  {
    title: 'acerca de',
    path: '/comming',
    icon: getIcon(infoFill)
  }
];

export default sidebarConfigAdm;