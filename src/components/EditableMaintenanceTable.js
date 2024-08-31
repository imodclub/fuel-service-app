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

const EditableMaintenanceTable = ({ maintenanceRecords = [], onEdit }) => {
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
            <TableCell>ค่าใช้จ่ายรวม (บาท)</TableCell>
            <TableCell>การดำเนินการ</TableCell>
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
              <TableCell>
                {record.totalCost !== undefined
                  ? record.totalCost.toFixed(2)
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => onEdit(record)}>
                  แก้ไข
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableMaintenanceTable;
