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

const MaintenanceTable = ({ maintenanceRecords = [] }) => {
  if (maintenanceRecords.length === 0) {
    return <Typography>ไม่มีข้อมูลการบำรุงรักษา</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>วันที่บำรุงรักษา</TableCell>
            <TableCell>ระยะทาง</TableCell>
            <TableCell>สถานที่</TableCell>
            <TableCell align="right">ค่าใช้จ่ายรวม (บาท)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenanceRecords.map((record) => (
            <TableRow key={record._id}>
              <TableCell>
                {new Date(record.serviceDate).toLocaleDateString('th-TH')}
              </TableCell>
              <TableCell>{record.mileage} กม.</TableCell>
              <TableCell>{record.location}</TableCell>
              <TableCell align="right">
                {record.totalCost !== undefined
                  ? record.totalCost.toFixed(2)
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaintenanceTable;
