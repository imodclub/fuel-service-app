import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const FuelRefillTable = ({ fuelRecords = [] }) => {
  const records = Array.isArray(fuelRecords) ? fuelRecords : [];

  const calculateAmount = (totalPrice, pricePerLiter) => {
    if (pricePerLiter && pricePerLiter !== 0) {
      return totalPrice / pricePerLiter;
    }
    return 0;
  };

  const calculateMileageDifference = (currentIndex) => {
    if (currentIndex === 0) return 0; // ไม่มีการเติมครั้งก่อน
    const currentMileage = records[currentIndex].mileage;
    const previousMileage = records[currentIndex - 1].mileage;
    return currentMileage - previousMileage;
  };

  if (records.length === 0) {
    return <Typography>ไม่มีข้อมูลการเติมน้ำมัน</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>วันที่เติมน้ำมัน</TableCell>
            <TableCell>จำนวนลิตร</TableCell>
            <TableCell>ราคาต่อลิตร (บาท)</TableCell>
            <TableCell>ราคารวม (บาท)</TableCell>
            <TableCell>ระยะทาง/กิโลเมตร</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={record._id}>
              <TableCell>
                {new Date(record.refillDate).toLocaleDateString('th-TH')}
              </TableCell>
              <TableCell>
                {calculateAmount(
                  record.totalPrice,
                  record.pricePerLiter
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                {record.pricePerLiter?.toFixed(2) || '0.00'}
              </TableCell>
              <TableCell>{record.totalPrice?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>{calculateMileageDifference(index)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FuelRefillTable;
