import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/router';

const formatNumber = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseNumber = (value) => {
  if (!value) return '';
  return value.replace(/,/g, '');
};

export default function FuelRefillForm({ open, onClose, vehicleId, onSave }) {
  const [refillDate, setRefillDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [mileage, setMileage] = useState('');
  const [lastMileage, setLastMileage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchLastMileage();
  }, [vehicleId]);

  const fetchLastMileage = async () => {
    try {
      const response = await fetch(`/api/lastMileage?vehicleId=${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setLastMileage(data.lastMileage);
      }
    } catch (error) {
      console.error('Error fetching last mileage:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentMileage = parseFloat(parseNumber(mileage));
    if (currentMileage < lastMileage) {
      setConfirmDialog(true);
    } else {
      submitForm();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    const refillData = {
      vehicleId,
      refillDate,
      totalPrice: parseFloat(parseNumber(totalPrice)),
      pricePerLiter: parseFloat(parseNumber(pricePerLiter)),
      mileage: parseFloat(parseNumber(mileage))
    };


    try {
      const response = await fetch('/api/fuelrefills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refillData),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);
        setAlert({ show: true, message: 'บันทึกข้อมูลสำเร็จ', severity: 'success' });
        setTimeout(() => {
          onClose();
          router.push('/userdashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlert({ show: true, message: errorData.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', severity: 'error' });
      }
    } catch (error) {
      console.error('Error saving fuel refill data:', error);
      setAlert({ show: true, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>บันทึกข้อมูลเติมน้ำมัน</DialogTitle>
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
                  fullWidth
                  margin="normal"
                  value={formatNumber(totalPrice)}
                  onChange={(e) => setTotalPrice(parseNumber(e.target.value))}
                  InputProps={{ 
                    startAdornment: '฿',
                    inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' }
                  }}
                />
                <TextField
                  label="ราคาน้ำมันต่อลิตร (บาท/ลิตร)"
                  fullWidth
                  margin="normal"
                  value={formatNumber(pricePerLiter)}
                  onChange={(e) => setPricePerLiter(parseNumber(e.target.value))}
                  InputProps={{ 
                    startAdornment: '฿',
                    inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' }
                  }}
                />
                <TextField
                  label="ระยะทางไมค์ที่เติม (กม.)"
                  fullWidth
                  margin="normal"
                  value={formatNumber(mileage)}
                  onChange={(e) => setMileage(parseNumber(e.target.value))}
                  InputProps={{ 
                    endAdornment: 'กม.',
                    inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' }
                  }}
                  helperText={`ระยะทางไมค์ครั้งล่าสุด: ${formatNumber(lastMileage)} กม.`}
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
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>ยืนยันการบันทึก</DialogTitle>
        <DialogContent>
          <Typography>
            ใส่จำนวนกิโลเมตร น้อยกว่าค่าเดิม ดำเนินการต่อหรือไม่?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>ยกเลิก</Button>
          <Button onClick={() => {
            setConfirmDialog(false);
            submitForm();
          }} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.show} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}