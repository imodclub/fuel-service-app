import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import Layout from '../components/Layout';
import MaintenanceTable from '../components/MaintenanceTable';

const MaintenanceInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState({});
  const [expanded, setExpanded] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

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
        data.forEach((vehicle) => fetchMaintenanceRecords(vehicle._id));
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
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

  const handleExpandClick = (vehicleId) => {
    setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          ข้อมูลการบำรุงรักษา
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
                  <Button
                    onClick={() => handleExpandClick(vehicle._id)}
                    sx={{ mt: 1 }}
                  >
                    {expanded[vehicle._id] ? 'ซ่อนประวัติ' : 'แสดงประวัติ'}
                  </Button>
                  <Collapse
                    in={expanded[vehicle._id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <MaintenanceTable
                      maintenanceRecords={maintenanceRecords[vehicle._id] || []}
                      onViewDetails={handleViewDetails}
                    />
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedRecord && (
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              รายละเอียดการบำรุงรักษา
            </Typography>
            <Typography>
              วันที่ :{' '}
              {new Date(selectedRecord.serviceDate).toLocaleDateString('th-TH')}
            </Typography>
            <Typography>ระยะทาง : {selectedRecord.mileage} กม.</Typography>
            <Typography>สถานที่ : {selectedRecord.location}</Typography>
            <Typography>รายการบำรุงรักษา</Typography>
            <ul>
              {selectedRecord.serviceItems &&
                selectedRecord.serviceItems.map((item, index) => (
                  <li key={index}>
                    {item.item} : {item.amount} บาท
                  </li>
                ))}
            </ul>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default MaintenanceInfo;
