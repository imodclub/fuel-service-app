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
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Layout from '../components/Layout';
import MaintenanceEditTable from '@/components/MaintenanceEditTable';

const EditResetInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [editingFuelRecord, setEditingFuelRecord] = useState(null);
  const [editingMaintenanceRecord, setEditingMaintenanceRecord] =
    useState(null);

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

  const handleEdit = async (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    await fetchFuelRecords(vehicleId);
    await fetchMaintenanceRecords(vehicleId);
  };

 const fetchFuelRecords = async (vehicleId) => {
  try {
    const response = await fetch(`/api/fuel-records?vehicleId=${vehicleId}`);
    if (response.ok) {
      const result = await response.json();
      setFuelRecords(Array.isArray(result.data) ? result.data : []);
      console.log('Fuel Records:', result.data);
    } else {
      console.error('Failed to fetch fuel records');
      setFuelRecords([]);
    }
  } catch (error) {
    console.error('Error fetching fuel records:', error);
    setFuelRecords([]);
  }
};

const fetchMaintenanceRecords = async (vehicleId) => {
  try {
    const response = await fetch(
      `/api/maintenance-records?vehicleId=${vehicleId}`
    );
    if (response.ok) {
      const result = await response.json();
      setMaintenanceRecords(Array.isArray(result.data) ? result.data : []);
      console.log('Maintenance Records:', result);
    } else {
      console.error('Failed to fetch maintenance records');
      setMaintenanceRecords([]);
    }
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    setMaintenanceRecords([]);
  }
};

  const handleEditFuelRecord = (record) => {
    setEditingFuelRecord(record);
  };

  const handleEditMaintenanceRecord = (record) => {
    setEditingMaintenanceRecord(record);
  };

  const handleSaveFuelRecord = async () => {
    try {
      const response = await fetch(
        `/api/fuel-records/${editingFuelRecord._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingFuelRecord),
        }
      );

      if (response.ok) {
        setEditingFuelRecord(null);
        await fetchFuelRecords(selectedVehicleId);
      } else {
        console.error('Failed to update fuel record');
      }
    } catch (error) {
      console.error('Error updating fuel record:', error);
    }
  };

  const handleSaveMaintenanceRecord = async () => {
    try {
      const response = await fetch(
        `/api/maintenance-records/${editingMaintenanceRecord._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingMaintenanceRecord),
        }
      );
      if (response.ok) {
        setEditingMaintenanceRecord(null);
        await fetchMaintenanceRecords(selectedVehicleId);
      } else {
        console.error('Failed to update maintenance record');
      }
    } catch (error) {
      console.error('Error updating maintenance record:', error);
    }
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
        fetchVehicles();
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

        {selectedVehicleId && (
          <>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                ข้อมูลการเติมน้ำมัน
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>วันที่</TableCell>
                      <TableCell>ปริมาณ (ลิตร)</TableCell>
                      <TableCell>ราคา (บาท)</TableCell>
                      <TableCell>การดำเนินการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(fuelRecords) && fuelRecords.length > 0 ? (
                      fuelRecords.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>
                            {new Date(record.refillDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{record.amount.toFixed(2)}</TableCell>
                          <TableCell>{record.totalPrice}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleEditFuelRecord(record)}
                            >
                              แก้ไข
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          ไม่มีข้อมูลการเติมน้ำมัน
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                ข้อมูลการบำรุงรักษา
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>วันที่</TableCell>
                      <TableCell>สถานที่</TableCell>
                      <TableCell>รายการ</TableCell>
                      <TableCell>ค่าใช้จ่าย (บาท)</TableCell>
                      <TableCell>การดำเนินการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(maintenanceRecords) &&
                    maintenanceRecords.length > 0 ? (
                      maintenanceRecords.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>
                            {new Date(record.serviceDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{record.location}</TableCell>
                          <TableCell>
                            {Array.isArray(record.serviceItems) &&
                            record.serviceItems.length > 0
                              ? record.serviceItems.map((item, index) => (
                                  <div key={index}>
                                    {index + 1}. {item.item}
                                  </div>
                                ))
                              : 'ไม่มีรายการ'}
                          </TableCell>
                          <TableCell>{record.mileage}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                handleEditMaintenanceRecord(record)
                              }
                            >
                              แก้ไข
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>
                          ไม่มีข้อมูลการบำรุงรักษา
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}

        <Dialog
          open={!!editingFuelRecord}
          onClose={() => setEditingFuelRecord(null)}
        >
          <DialogTitle>แก้ไขข้อมูลการเติมน้ำมัน</DialogTitle>
          <DialogContent>
            <TextField
              label="วันที่"
              type="date"
              value={editingFuelRecord?.refillDate.split('T')[0]}
              onChange={(e) =>
                setEditingFuelRecord({
                  ...editingFuelRecord,
                  refillDate: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="ปริมาณ (ลิตร)"
              type="number"
              value={editingFuelRecord?.amount}
              onChange={(e) =>
                setEditingFuelRecord({
                  ...editingFuelRecord,
                  amount: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="ราคารวม (บาท)"
              type="number"
              value={editingFuelRecord?.totalPrice}
              onChange={(e) =>
                setEditingFuelRecord({
                  ...editingFuelRecord,
                  totalPrice: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingFuelRecord(null)}>ยกเลิก</Button>
            <Button onClick={handleSaveFuelRecord} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={!!editingMaintenanceRecord}
          onClose={() => setEditingMaintenanceRecord(null)}
        >
          <DialogTitle>แก้ไขข้อมูลการบำรุงรักษา</DialogTitle>
          <DialogContent>
            <TextField
              label="วันที่"
              type="date"
              value={editingMaintenanceRecord?.serviceDate.split('T')[0]}
              onChange={(e) =>
                setEditingMaintenanceRecord({
                  ...editingMaintenanceRecord,
                  serviceDate: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="รายการ"
              value={editingMaintenanceRecord?.serviceItems[0]?.item || ''}
              onChange={(e) =>
                setEditingMaintenanceRecord({
                  ...editingMaintenanceRecord,
                  serviceItems: [
                    {
                      ...editingMaintenanceRecord.serviceItems[0],
                      item: e.target.value,
                    },
                  ],
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="ค่าใช้จ่าย (บาท)"
              type="number"
              value={editingMaintenanceRecord?.totalCost}
              onChange={(e) =>
                setEditingMaintenanceRecord({
                  ...editingMaintenanceRecord,
                  totalCost: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingMaintenanceRecord(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveMaintenanceRecord} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openResetDialog}
          onClose={() => setOpenResetDialog(false)}
        >
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
      </Box>
    </Layout>
  );
};

export default EditResetInfo;
