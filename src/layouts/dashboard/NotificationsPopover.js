import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import faker from 'faker';
import PropTypes from 'prop-types';
import { set, sub, formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import { alpha } from '@mui/material/styles';
import { Box, List, Badge, Avatar, Tooltip, Divider, IconButton, Typography, ListItemText, 
  ListItemAvatar, ListItemButton } from '@mui/material';
import MockImgAvatar from '../../utils/mockImages';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';

const NOTIFICATIONS = [
  {
    id: faker.datatype.uuid(),
    title: 'Haz agendado una asesoría',
    description: 'puedes consultarla en tu calendario',
    avatar: null,
    type: 'new_advise',
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    isUnRead: true
  },
  {
    id: faker.datatype.uuid(),
    title: 'Margarita Bailón',
    description: 'agregó una nueva asesoría',
    avatar: MockImgAvatar(),
    type: 'fav_advisor',
    createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Haz agendado una asesoría',
    description: 'puedes consultarla en tu calendario',
    avatar: null,
    type: 'new_advise',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false
  }
];

function RenderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'new_advise') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_package.svg" />,
      title
    };
  }
  if (notification.type === 'fav_advisor') {
    return {
      avatar: <img alt={notification.title} src={`data:image/png;base64,${notification.avatar}`} />,
      title
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
      title
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
      title
    };
  }
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  const { avatar, title } = RenderContent(notification);

  return (
    <ListItemButton
      to="#"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false
      }))
    );
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificaciones</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tienes {totalUnRead} {totalUnRead === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Marcar todo como leído">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

          <List disablePadding>
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

export default NotificationsPopover;