import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Typography,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Container,
} from '@mui/material';
import VehicleCard from '../components/VehicleCard';
import FuelRefillForm from '@/components/FuelRefillForm';

export default function UserDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [openRefillForm, setOpenRefillForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleDeleteClick = (vehicleId) => {
    setVehicleToDelete(vehicleId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      try {
        const response = await fetch(`/api/vehicles/${vehicleToDelete}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleToDelete));
          setOpenDeleteDialog(false);
          setVehicleToDelete(null);
        } else {
          console.error('Failed to delete vehicle');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setVehicleToDelete(null);
  };

  const handleRefillClick = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenRefillForm(true);
  };

  const handleRefillSave = async (newRefillData) => {
    // อัปเดต state หรือ refetch ข้อมูลรถหากจำเป็น
    console.log('New refill data:', newRefillData);
    await fetchVehicles(); // หรือปรับปรุง state ตามความเหมาะสม
    if (newRefillData.vehicleId) {
      await fetchRefillHistory(newRefillData.vehicleId);
    }
  };

  const fetchRefillHistory = async (vehicleId) => {
    try {
      const response = await fetch(`/api/fuelrefills?vehicleId=${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setRefillHistories(prev => ({ ...prev, [vehicleId]: data }));
      } else {
        console.error('Failed to fetch refill history');
      }
    } catch (error) {
      console.error('Error fetching refill history:', error);
    }
  };


  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            {vehicles.map((vehicle) => (
              <Grid item xs={14} sm={8} md={8} key={vehicle._id}>
                <VehicleCard
                  vehicle={vehicle}
                  onDelete={() => handleDeleteClick(vehicle._id)}
                  onRefill={() => handleRefillClick(vehicle._id)}
                />
                
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <FuelRefillForm
        open={openRefillForm}
        onClose={() => setOpenRefillForm(false)}
        vehicleId={selectedVehicleId}
        onSave={handleRefillSave}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ยืนยันการลบข้อมูลรถ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ข้อมูลรถทั้งหมดจะถูกลบ คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>ยกเลิก</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            ยืนยันการลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}