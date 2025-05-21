import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface AlgorithmCardProps {
  id: string;
  title: string;
  description: string;
  preemptive: boolean;
  parameters?: {
    [key: string]: string;
  };
  strengths?: string[];
  weaknesses?: string[];
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  id,
  title,
  description,
  preemptive,
  parameters,
  strengths,
  weaknesses,
}) => {
  return (
    <Card 
      component={RouterLink} 
      to={`/cpu-scheduler/algorithm/${id}`}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1, 
            gap: 1,
            flexWrap: 'wrap'
          }}>
            <Typography variant="h6" component="div" color="text.primary" sx={{ mr: 1 }}>
              {title}
            </Typography>
            <Chip
              label={preemptive ? 'Preemptive' : 'Non-preemptive'}
              color={preemptive ? 'primary' : 'default'}
              size="small"
            />
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{ 
              mb: 2,
              minHeight: '3em',
              textAlign: 'left'
            }}
          >
            {description}
          </Typography>

          {parameters && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Parameters:</Typography>
              {Object.entries(parameters).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {value}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ width: '100%', mb: 2 }} />
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Strengths:
          </Typography>
          {strengths && (
            <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 1.5 }}>
              {strengths.map((strength, i) => (
                <Typography key={i} component="li" variant="body2" sx={{ textAlign: 'left' }}>
                  {strength}
                </Typography>
              ))}
            </Box>
          )}
          
          <Typography variant="subtitle2" color="error" gutterBottom>
            Weaknesses:
          </Typography>
          {weaknesses && (
            <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 0 }}>
              {weaknesses.map((weakness, i) => (
                <Typography key={i} component="li" variant="body2" sx={{ textAlign: 'left' }}>
                  {weakness}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlgorithmCard; 