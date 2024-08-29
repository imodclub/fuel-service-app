import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Collapse, Box } from '@mui/material';
import Layout from '../components/Layout';
import FuelRefillTable from '../components/FuelRefillTable';

const FuelInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchVehicles();
      vehicles.forEach(vehicle => fetchFuelRecords(vehicle._id));
    };
  
    fetchAllData();
  }, []);

  const fetchVehicles = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      const response = await fetch(`/api/vehicles?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
        data.forEach(vehicle => fetchFuelRecords(vehicle._id));
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchFuelRecords = async (vehicleId) => {
    try {
      const response = await fetch(`/api/fuel-records?vehicleId=${vehicleId}`);
      if (response.ok) {
        const { data } = await response.json();
        // จัดการกับข้อมูลที่ได้รับ เช่น อัปเดต state
        setFuelRecords(prevRecords => ({
          ...prevRecords,
          [vehicleId]: data
        }));
      } else {
        console.error('Failed to fetch fuel records');
      }
    } catch (error) {
      console.error('Error fetching fuel records:', error);
    }
  };

  const handleExpandClick = (vehicleId) => {
    setExpanded(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>ข้อมูลการเติมน้ำมัน</Typography>
        {vehicles.map((vehicle) => (
          <Card key={vehicle._id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{vehicle.brand} {vehicle.model}</Typography>
              <Typography variant="body2">
                ทะเบียนรถ: {vehicle.licensePlate}
              </Typography>
              <Button onClick={() => handleExpandClick(vehicle._id)} sx={{ mt: 1 }}>
                {expanded[vehicle._id] ? 'ซ่อนประวัติ' : 'แสดงประวัติ'}
              </Button>
              <Collapse in={expanded[vehicle._id]} timeout="auto" unmountOnExit>
                <FuelRefillTable fuelRecords={fuelRecords[vehicle._id] || []} />
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Layout>
  );
};

export default FuelInfo;