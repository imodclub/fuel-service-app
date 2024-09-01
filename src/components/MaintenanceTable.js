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
  Button,
} from '@mui/material';

const MaintenanceTable = ({ maintenanceRecords = [], onViewDetails }) => {
  if (maintenanceRecords.length === 0) {
    return <Typography>ไม่มีข้อมูลการบำรุงรักษา</Typography>;
  }

  // คำนวณผลรวมค่าใช้จ่าย
  const totalCost = maintenanceRecords.reduce((sum, record) => {
    const serviceCost = record.serviceItems
      ? record.serviceItems.reduce(
          (itemSum, item) => itemSum + (parseFloat(item.amount) || 0),
          0
        )
      : 0;
    return sum + serviceCost;
  }, 0);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>วันที่บำรุงรักษา</TableCell>
            <TableCell>ระยะทาง</TableCell>
            <TableCell>สถานที่</TableCell>
            <TableCell align="right">ค่าใช้จ่ายรวม (บาท)</TableCell>
            <TableCell>ดูข้อมูล</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenanceRecords.map((record) => {
            const recordTotalCost = record.serviceItems
              ? record.serviceItems.reduce(
                  (sum, item) => sum + (parseFloat(item.amount) || 0),
                  0
                )
              : 0;
            return (
              <TableRow key={record._id}>
                <TableCell>
                  {new Date(record.serviceDate).toLocaleDateString('th-TH')}
                </TableCell>
                <TableCell>{record.mileage} กม.</TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell align="right">
                  {recordTotalCost.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button onClick={() => onViewDetails(record)}>
                    ดูข้อมูล
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {/* แถวสรุปผลรวมค่าใช้จ่าย */}
          <TableRow>
            <TableCell colSpan={3} align="right">
              <strong>ผลรวมค่าใช้จ่ายทั้งหมด:</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{totalCost.toFixed(2)}</strong>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaintenanceTable;
