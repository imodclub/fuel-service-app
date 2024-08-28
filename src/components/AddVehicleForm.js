import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import VehicleCard from './VehicleCard';
import { Router, useRouter } from 'next/router';

export default function AddVehicleForm({ open, onClose, userId }) {
  const router = useRouter;
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: '',
    brand: '',
    model: '',
    engineCC: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [savedVehicle, setSavedVehicle] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/addVehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (response.ok) {
        const result = await response.json();
        setSavedVehicle({ ...formData, id: result.id });
        setShowSnackbar(true);
        setFormData({
          licensePlate: '',
          vehicleType: '',
          brand: '',
          model: '',
          engineCC: '',
        });
        onClose();
        window.location.href="/userdashboard"
        
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>เพิ่มข้อมูลรถ</DialogTitle>
        <DialogContent>
          {isLoading && <LinearProgress />}
          <TextField
            name="licensePlate"
            label="ทะเบียนรถ"
            fullWidth
            margin="normal"
            value={formData.licensePlate}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>ประเภทรถ</InputLabel>
            <Select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <MenuItem value="รถยนต์">รถยนต์</MenuItem>
              <MenuItem value="รถจักรยานยนต์">จักรยานยนต์</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="brand"
            label="ยี่ห้อ"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            name="model"
            label="รุ่น"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            name="engineCC"
            label="CC เครื่องยนต์"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        message="บันทึกข้อมูลรถสำเร็จ"
      />
      {savedVehicle && <VehicleCard vehicle={savedVehicle} />}
    </>
  );
}
