import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Collapse, Box } from '@mui/material';

const VehicleInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage
        if (!userId) {
          console.error('User ID not found');
          return;
        }
        const response = await fetch(`/api/vehicles?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          console.error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleExpandClick = (vehicleId) => {
    setExpanded(expanded === vehicleId ? null : vehicleId);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      {vehicles.map((vehicle) => (
        <Card key={vehicle._id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5">{vehicle.brand} {vehicle.model}</Typography>
            <Typography variant="body2" color="text.secondary">
              ทะเบียนรถ: {vehicle.licensePlate}
            </Typography>
            <Typography variant="body2">
              ประเภทรถ: {vehicle.vehicleType}
            </Typography>
            <Typography variant="body2">
              CC เครื่องยนต์: {vehicle.engineCC}
            </Typography>
            <Button onClick={() => handleExpandClick(vehicle._id)} sx={{ mt: 1 }}>
              {expanded === vehicle._id ? 'ซ่อนประวัติ' : 'แสดงประวัติ'}
            </Button>
            <Collapse in={expanded === vehicle._id} timeout="auto" unmountOnExit>
              <Typography paragraph sx={{ mt: 2 }}>
                ประวัติรถ: ยังไม่มีข้อมูลประวัติ
              </Typography>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default VehicleInfo;