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

const EditableFuelRefillTable = ({ fuelRecords = [], onEdit }) => {
  if (fuelRecords.length === 0) {
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
            <TableCell>การดำเนินการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fuelRecords.map((record) => (
            <TableRow key={record._id}>
              <TableCell>
                {new Date(record.refillDate).toLocaleDateString('th-TH')}
              </TableCell>
              <TableCell>{record.amount.toFixed(2)}</TableCell>
              <TableCell>{record.pricePerLiter.toFixed(2)}</TableCell>
              <TableCell>{record.totalPrice.toFixed(2)}</TableCell>
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

export default EditableFuelRefillTable;
