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

const MaintenanceEditTable = ({ maintenanceRecords, onUpdate }) => {
  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/maintenance-records/${editingRecord._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingRecord),
        }
      );
      if (response.ok) {
        setEditingRecord(null);
        onUpdate();
      } else {
        console.error('Failed to update maintenance record');
      }
    } catch (error) {
      console.error('Error updating maintenance record:', error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่</TableCell>
              <TableCell>รายการ</TableCell>
              <TableCell>ค่าใช้จ่าย (บาท)</TableCell>
              <TableCell>การดำเนินการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenanceRecords.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {new Date(record.serviceDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.serviceItems[0]?.item || 'N/A'}</TableCell>
                <TableCell>{record.totalCost}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(record)}>แก้ไข</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingRecord} onClose={() => setEditingRecord(null)}>
        <DialogTitle>แก้ไขข้อมูลการบำรุงรักษา</DialogTitle>
        <DialogContent>
          <TextField
            label="วันที่"
            type="date"
            value={editingRecord?.serviceDate.split('T')[0]}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                serviceDate: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="รายการ"
            value={editingRecord?.serviceItems[0]?.item || ''}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                serviceItems: [
                  { ...editingRecord.serviceItems[0], item: e.target.value },
                ],
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="ค่าใช้จ่าย (บาท)"
            type="number"
            value={editingRecord?.totalCost}
            onChange={(e) =>
              setEditingRecord({ ...editingRecord, totalCost: e.target.value })
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

export default MaintenanceEditTable;
