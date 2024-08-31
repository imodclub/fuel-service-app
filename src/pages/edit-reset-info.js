import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Layout from '../components/Layout';

const EditResetInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
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
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleEdit = (vehicleId) => {
    console.log('Edit vehicle:', vehicleId);
  };

  const handleReset = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenResetDialog(true);
  };

  const handleDelete = (vehicleId) => {
    console.log('Delete vehicle:', vehicleId);
  };

  const confirmReset = async () => {
    try {
      const response = await fetch(
        `/api/fuelrefills?vehicleId=${selectedVehicleId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        console.log('Fuel refill data reset successfully');
        setOpenResetDialog(false);
        fetchVehicles(); // Refresh vehicle list if needed
      } else {
        console.error('Failed to reset fuel refill data');
      }
    } catch (error) {
      console.error('Error resetting fuel refill data:', error);
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          แก้ไขและรีเซ็ตข้อมูล
        </Typography>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} key={vehicle._id}>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Typography variant="body2">
                    ทะเบียนรถ: {vehicle.licensePlate}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(vehicle._id)}
                      sx={{ mr: 1 }}
                    >
                      แก้ไขข้อมูล
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleReset(vehicle._id)}
                      sx={{ mr: 1 }}
                    >
                      รีเซ็ตข้อมูล
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      ลบข้อมูล
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>ยืนยันการรีเซ็ตข้อมูล</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ต้องการรีเซ็ตข้อมูลการเติมน้ำมันใช่หรือไม่?
            คุณจะรีเซ็ตได้เฉพาะข้อมูลการเติมน้ำมันเท่านั้น
            เมื่อกดปุ่มรีเซ็ตไปแล้ว จะไม่สามารถเรียกคืนประวัติการเติมน้ำมันได้
            และคุณไม่สามารถรีเซ็ตข้อมูลการบำรุงรักษาได้
            เพราะรถจำเป็นต้องมีการเก็บประวัติการบำรุงรักษา
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={confirmReset} color="secondary">
            ใช่
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default EditResetInfo;
