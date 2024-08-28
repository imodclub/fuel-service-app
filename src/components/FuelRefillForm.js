import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function FuelRefillForm({ open, onClose, vehicleId, onSave }) {
  const [refillDate, setRefillDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const refillData = {
      vehicleId,
      refillDate,
      totalPrice: parseFloat(totalPrice),
      pricePerLiter: parseFloat(pricePerLiter),
      mileage: parseInt(mileage, 10)
    };

    try {
      const response = await fetch('/api/fuelRefills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refillData),
      });

      if (response.ok) {
        onSave(await response.json());
        onClose();
      } else {
        console.error('Failed to save fuel refill data');
      }
    } catch (error) {
      console.error('Error saving fuel refill data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          บันทึกข้อมูลเติมน้ำมัน
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="วันที่เติมน้ำมัน"
                  value={refillDate}
                  onChange={(newValue) => setRefillDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
              <TextField
                label="ราคาน้ำมันที่เติม (บาท)"
                type="number"
                fullWidth
                margin="normal"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                InputProps={{ startAdornment: '฿' }}
              />
              <TextField
                label="ราคาน้ำมันต่อลิตร (บาท/ลิตร)"
                type="number"
                fullWidth
                margin="normal"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
                InputProps={{ startAdornment: '฿' }}
              />
              <TextField
                label="ระยะทางไมค์ที่เติม (กม.)"
                type="number"
                fullWidth
                margin="normal"
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                InputProps={{ endAdornment: 'กม.' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" gutterBottom>
                ราคาน้ำมันปัจจุบัน
              </Typography>
              <Box sx={{ flexGrow: 1, overflow: 'hidden', borderRadius: 1, boxShadow: 1 }}>
                <iframe
                  src="https://oil-price.bangchak.co.th/BcpOilPrice1/th"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Fuel Price Chart"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          ยกเลิก
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}