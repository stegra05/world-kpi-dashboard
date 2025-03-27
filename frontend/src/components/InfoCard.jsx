import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
} from '@mui/material';
import { formatNumber } from '../utils/formatUtils';

const InfoCard = ({ title, value, subtitle, icon }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Convert string 'No country selected' to 'Global View' for display
  const displayValue = value === 'No country selected' ? 'Global View' : value;

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          p: isSmallScreen ? 2 : 3,
          pb: isSmallScreen ? 2 : 3,
          '&:last-child': { pb: isSmallScreen ? 2 : 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            component="h2"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: isSmallScreen ? '0.8rem' : '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Avatar
              sx={{
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(25, 118, 210, 0.12)' 
                  : 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                width: isSmallScreen ? 36 : 40,
                height: isSmallScreen ? 36 : 40,
                position: 'absolute',
                top: isSmallScreen ? -12 : -16,
                right: isSmallScreen ? 12 : 16,
                boxShadow: 2,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
        
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            fontSize: isSmallScreen ? '1.5rem' : '1.75rem',
            lineHeight: 1.2,
            mb: subtitle ? 1.5 : 0,
            mt: 1,
          }}
        >
          {typeof displayValue === 'number' ? formatNumber(displayValue) : displayValue}
        </Typography>
        
        {subtitle && (
          <>
            <Divider sx={{ my: 1.5, opacity: 0.6 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                fontWeight: 400,
                lineHeight: 1.5,
                mt: 'auto',
              }}
            >
              {subtitle}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
};

InfoCard.defaultProps = {
  subtitle: '',
  icon: null,
};

export default InfoCard; 