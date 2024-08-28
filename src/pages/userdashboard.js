import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Typography, Grid, Box, useMediaQuery, useTheme } from '@mui/material';
import VehicleCard from '../components/VehicleCard';

export default function UserDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/vehicles?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };
  
const matches = useMediaQuery('(min-width:600px)');
  

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item  xs={matches} key={vehicle.id || vehicle._id}>
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}