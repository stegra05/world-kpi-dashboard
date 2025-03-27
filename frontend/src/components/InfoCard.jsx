import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { formatNumber } from '../utils/formatUtils';

const InfoCard = ({ title, value, subtitle, icon }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: 'auto',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        p: isSmallScreen ? 1.5 : 2,
        '&:last-child': { pb: isSmallScreen ? 1.5 : 2 },
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            component="h2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                '& > svg': {
                  fontSize: isSmallScreen ? '1.25rem' : '1.5rem',
                },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            fontSize: isSmallScreen ? '1.25rem' : '1.5rem',
            lineHeight: 1.2,
            mb: subtitle ? 0.5 : 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value === 'No country selected' && subtitle !== "Click a country on the map" ? 'Global View' : formatNumber(value)}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
              fontWeight: 400,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
              flexGrow: 1,
              minHeight: 0,
              display: 'block',
            }}
          >
            {subtitle === "Click a country on the map" ? "Showing all countries, click map to select one" : subtitle}
          </Typography>
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