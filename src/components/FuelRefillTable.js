import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const FuelRefillTable = ({ fuelRecords = [] }) => {
  const records = Array.isArray(fuelRecords) ? fuelRecords : [];

  const calculateAmount = (totalPrice, pricePerLiter) => {
    if (pricePerLiter && pricePerLiter !== 0) {
      return totalPrice / pricePerLiter;
    }
    return 0;
  };

  const totalAmount = records.reduce((sum, record) => 
    sum + calculateAmount(record.totalPrice, record.pricePerLiter), 0);
  const totalPrice = records.reduce((sum, record) => sum + (record.totalPrice || 0), 0);

  if (records.length === 0) {
    return <Typography>ไม่มีข้อมูลการเติมน้ำมัน</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>วันที่เติมน้ำมัน</TableCell>
            <TableCell align="right">จำนวนลิตร</TableCell>
            <TableCell align="right">ราคาต่อลิตร (บาท)</TableCell>
            <TableCell align="right">ราคารวม (บาท)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{new Date(record.refillDate).toLocaleDateString('th-TH')}</TableCell>
              <TableCell align="right">
                {calculateAmount(record.totalPrice, record.pricePerLiter).toFixed(2)}
              </TableCell>
              <TableCell align="right">{record.pricePerLiter?.toFixed(2) || '0.00'}</TableCell>
              <TableCell align="right">{record.totalPrice?.toFixed(2) || '0.00'}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={1} align="right"><strong>รวม</strong></TableCell>
            <TableCell align="right"><strong>{totalAmount.toFixed(2)}</strong></TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right"><strong>{totalPrice.toFixed(2)}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FuelRefillTable;