import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Typography, Grid, Box, useMediaQuery, useTheme,Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button  } from '@mui/material';
import VehicleCard from '../components/VehicleCard';
import FuelRefillForm from '@/components/FuelRefillForm';

export default function UserDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [vehicleToDelete, setVehicleToDelete] = useState(null);
const [openRefillForm, setOpenRefillForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

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

  const handleRefillSave = (newRefillData) => {
    // อัปเดต state หรือ refetch ข้อมูลรถหากจำเป็น
    console.log('New refill data:', newRefillData);
    fetchVehicles(); // หรือปรับปรุง state ตามความเหมาะสม
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
            <Grid item  xs={matches} sx={{width : '100'}} key={vehicle.id || vehicle._id}>
              <VehicleCard 
              vehicle={vehicle} 
              onDelete={() => handleDeleteClick(vehicle._id)}
              onRefill={() => handleRefillClick(vehicle._id)}
            />
            </Grid>
          ))}
        </Grid>
      </Box>
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
      <DialogTitle id="alert-dialog-title">{"ยืนยันการลบข้อมูลรถ"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ข้อมูลรถทั้งหมดจะถูกลบ คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>ยกเลิก</Button>
        <Button onClick={handleDeleteConfirm} autoFocus>
          ยืนยันการลบ
        </Button>
      </DialogActions>
    </Dialog>
    </Layout>
  );
}