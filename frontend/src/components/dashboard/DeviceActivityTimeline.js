import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const DeviceActivityTimeline = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body1">Aucune activité récente</Typography>
      </Box>
    );
  }

  return (
    <List>
      {activities.map((activity, index) => (
        <ListItem key={index} divider={index < activities.length - 1}>
          <ListItemText
            primary={`${activity.deviceId}`}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ display: 'block' }}
                >
                  {activity.description || 'Activité de l\'appareil'}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                >
                  {new Date(activity.timestamp).toLocaleString()}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default DeviceActivityTimeline;