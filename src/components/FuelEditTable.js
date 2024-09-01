import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const FuelEditTable = ({ fuelRecords, onUpdate }) => {
  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/fuel-records/${editingRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRecord),
      });
      if (response.ok) {
        setEditingRecord(null);
        onUpdate();
      } else {
        console.error('Failed to update fuel record');
      }
    } catch (error) {
      console.error('Error updating fuel record:', error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่</TableCell>
              <TableCell>ปริมาณ (ลิตร)</TableCell>
              <TableCell>ราคารวม (บาท)</TableCell>
              <TableCell>การดำเนินการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fuelRecords.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {new Date(record.refillDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.totalPrice}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(record)}>แก้ไข</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingRecord} onClose={() => setEditingRecord(null)}>
        <DialogTitle>แก้ไขข้อมูลการเติมน้ำมัน</DialogTitle>
        <DialogContent>
          <TextField
            label="วันที่"
            type="date"
            value={editingRecord?.refillDate.split('T')[0]}
            onChange={(e) =>
              setEditingRecord({ ...editingRecord, refillDate: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="ปริมาณ (ลิตร)"
            type="number"
            value={editingRecord?.amount}
            onChange={(e) =>
              setEditingRecord({ ...editingRecord, amount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="ราคารวม (บาท)"
            type="number"
            value={editingRecord?.totalPrice}
            onChange={(e) =>
              setEditingRecord({ ...editingRecord, totalPrice: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingRecord(null)}>ยกเลิก</Button>
          <Button onClick={handleSave} color="primary">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FuelEditTable;
