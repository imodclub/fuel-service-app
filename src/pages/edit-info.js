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
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import Layout from '../components/Layout';
import EditableFuelRefillTable from '../components/EditableFuelRefillTable';
import EditableMaintenanceTable from '../components/EditableMaintenanceTable';
import { useRouter } from 'next/router';

const EditInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState({});
  const [maintenanceRecords, setMaintenanceRecords] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'info',
  });
  const router = useRouter();

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
        data.forEach((vehicle) => {
          fetchFuelRecords(vehicle._id);
          fetchMaintenanceRecords(vehicle._id);
        });
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
        setFuelRecords((prev) => ({ ...prev, [vehicleId]: data }));
      } else {
        console.error('Failed to fetch fuel records');
      }
    } catch (error) {
      console.error('Error fetching fuel records:', error);
    }
  };

  const fetchMaintenanceRecords = async (vehicleId) => {
    try {
      const response = await fetch(
        `/api/maintenance-records?vehicleId=${vehicleId}`
      );
      if (response.ok) {
        const { data } = await response.json();
        setMaintenanceRecords((prev) => ({ ...prev, [vehicleId]: data }));
      } else {
        console.error('Failed to fetch maintenance records');
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/records/${selectedRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRecord),
      });
      if (response.ok) {
        setAlert({
          show: true,
          message: 'แก้ไขข้อมูลสำเร็จ',
          severity: 'success',
        });
        setTimeout(() => {
          setOpenEditDialog(false);
          router.push('/edit-info');
        }, 3000);
      } else {
        console.error('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          แก้ไขข้อมูล
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
                  <EditableFuelRefillTable
                    fuelRecords={fuelRecords[vehicle._id] || []}
                    onEdit={handleEdit}
                  />
                  <EditableMaintenanceTable
                    maintenanceRecords={maintenanceRecords[vehicle._id] || []}
                    onEdit={handleEdit}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>แก้ไขข้อมูล</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="รายละเอียด"
            value={selectedRecord?.details || ''}
            onChange={(e) =>
              setSelectedRecord({ ...selectedRecord, details: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="จำนวนเงิน"
            value={selectedRecord?.amount || ''}
            onChange={(e) =>
              setSelectedRecord({ ...selectedRecord, amount: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            ยกเลิก
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, show: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default EditInfo;
