import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Box,
  Grid,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/Layout';
import FuelRefillTable from '../components/FuelRefillTable';

const FuelInfo = () => {
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState({});
  const [expanded, setExpanded] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [startMileage, setStartMileage] = useState(null);
  const [endMileage, setEndMileage] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchVehicles();
  };

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
        data.forEach((vehicle) => fetchFuelRecords(vehicle._id));
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
        setFuelRecords((prevRecords) => ({
          ...prevRecords,
          [vehicleId]: data,
        }));
      } else {
        console.error('Failed to fetch fuel records');
      }
    } catch (error) {
      console.error('Error fetching fuel records:', error);
    }
  };

  const handleExpandClick = (vehicleId) => {
    setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  const calculateFuelEfficiency = () => {
    if (!startDate || !endDate || !selectedVehicle) {
      setCalculationResult('กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุดและรถ');
      return;
    }

    let totalDistance = 0;
    let totalFuel = 0;

    vehicles.forEach((vehicle) => {
      const records = fuelRecords[vehicle._id] || [];
      const filteredRecords = records.filter((record) => {
        const recordDate = new Date(record.refillDate);
        recordDate.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็นเที่ยงคืน
        return recordDate >= startDate && recordDate <= endDate;
      });

      if (filteredRecords.length >= 2) {
        const firstRecord = filteredRecords[0];
        const lastRecord = filteredRecords[filteredRecords.length - 1];

        setStartMileage(firstRecord.mileage);
        setEndMileage(lastRecord.mileage);
        totalDistance = lastRecord.mileage - firstRecord.mileage;
        totalFuel = filteredRecords.reduce(
          (sum, record) => sum + record.totalPrice / record.pricePerLiter,
          0
        );
      }
    });

    if (totalFuel === 0) {
      setCalculationResult('ไม่สามารถคำนวณได้');
      return;
    }

    const efficiency = (totalDistance / totalFuel).toFixed(2);
    setCalculationResult(
      `ระยะทางรวม: ${totalDistance} กม., ปริมาณน้ำมันที่ใช้: ${totalFuel.toFixed(
        2
      )} ลิตร, อัตราการกินน้ำมัน: ${efficiency} กม./ลิตร`
    );
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          ข้อมูลการเติมน้ำมัน
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
                    <FuelRefillTable
                      fuelRecords={fuelRecords[vehicle._id] || []}
                    />
                    <Typography variant="body" sx={{ mt: 2 }}>
                      * หมายเหตุ : การคำนวณระยะทางในตารางคือ
                      ระยะเวลาก่อนหน้าที่เติมน้ำมัน
                      และระยะทางสุดท้ายที่เติมน้ำมัน
                      นั่นคือระยะทางที่รถวิ่งได้ในการเติมน้ำมันแต่ล่ะครั้ง
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            คำนวณค่าน้ำมัน
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="vehicle-select-label">เลือกรถ</InputLabel>
            <Select
              labelId="vehicle-select-label"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              label="เลือกรถ"
            >
              <MenuItem value="">
                <em>เลือกรถ</em>
              </MenuItem>
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="วันที่เริ่มต้น"
                  value={startDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      newValue.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็นเที่ยงคืน
                    }
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                {startMileage !== null && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    กิโลเมตรที่เริ่ม: {startMileage} กม.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="วันที่สิ้นสุด"
                  value={endDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      newValue.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็นเที่ยงคืน
                    }
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                {endMileage !== null && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    กิโลเมตรที่สิ้นสุด: {endMileage} กม.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateFuelEfficiency}
            sx={{ mt: 2 }}
          >
            คำนวณ
          </Button>
          {calculationResult && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {calculationResult}
            </Typography>
          )}
        </Paper>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            ผลการคำนวณเป็นเพียงการประมาณการคร่าวๆเท่านั้น
            ไม่สามารถอ้างอิงจากเครื่องยนต์โดยตรงได้
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};

export default FuelInfo;
