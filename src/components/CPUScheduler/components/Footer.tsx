import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          CPU Scheduling Algorithm Visualization
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} - Created for educational purposes
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 