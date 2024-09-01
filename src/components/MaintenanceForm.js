import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  DialogContentText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';

const formatNumber = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseNumber = (value) => {
  if (!value) return '';
  return value.replace(/,/g, '');
};

export default function MaintenanceForm({
  open,
  onClose,
  vehicleId,
  lastMileage,
}) {
  const [mileage, setMileage] = useState('');
  const [mileageError, setMileageError] = useState('');
  const [location, setLocation] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date());
  const [serviceItems, setServiceItems] = useState([]);
  const [newItem, setNewItem] = useState({ item: '', amount: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'info',
  });
  const [showNoItemsDialog, setShowNoItemsDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const validateMileage = (value) => {
    const parsedValue = parseFloat(parseNumber(value));
    if (isNaN(parsedValue)) {
      setMileageError('กรุณากรอกตัวเลขที่ถูกต้อง');
    } else if (parsedValue <= lastMileage) {
      setMileageError(`ระยะทางต้องมากกว่า ${formatNumber(lastMileage)} กม.`);
    } else {
      setMileageError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mileageError) {
      setAlert({
        show: true,
        message: 'กรุณาแก้ไขข้อมูลระยะทางให้ถูกต้อง',
        severity: 'error',
      });
      return;
    }
    if (serviceItems.length === 0) {
      setShowNoItemsDialog(true);
      return;
    }

    setIsSubmitting(true);
    const maintenanceData = {
      vehicleId,
      mileage: parseNumber(mileage),
      location,
      serviceDate,
      serviceItems,
      createdAt: new Date(),
    };

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceData),
      });

      if (response.ok) {
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
          onClose();
          router.push('/userdashboard');
        }, 3000);
      } else {
        setAlert({
          show: true,
          message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving maintenance data:', error);
      setAlert({
        show: true,
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    if (newItem.item && newItem.amount) {
      setServiceItems([...serviceItems, newItem]);
      setNewItem({ item: '', amount: '', details: '' });
    }
  };

  const removeItem = (index) => {
    const newItems = serviceItems.filter((_, i) => i !== index);
    setServiceItems(newItems);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>บันทึกข้อมูลการบำรุงรักษา</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ระยะทางกิโลเมตร"
                value={formatNumber(mileage)}
                onChange={(e) => {
                  const value = parseNumber(e.target.value);
                  setMileage(value);
                  validateMileage(value);
                }}
                onBlur={() => validateMileage(mileage)}
                error={!!mileageError}
                helperText={mileageError}
                InputProps={{
                  endAdornment: 'กม.',
                  inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="สถานที่"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="วันที่เข้ารับบริการ"
                  value={serviceDate}
                  onChange={(newValue) => setServiceDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
          </Grid>
          <Box mt={2}>
            <Typography variant="subtitle1">บันทึกรายการ</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="รายการ"
                  value={newItem.item}
                  onChange={(e) =>
                    setNewItem({ ...newItem, item: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="จำนวนเงิน"
                  value={formatNumber(newItem.amount)}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      amount: parseNumber(e.target.value),
                    })
                  }
                  InputProps={{
                    startAdornment: '฿',
                    inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="รายละเอียด"
                  value={newItem.details}
                  onChange={(e) =>
                    setNewItem({ ...newItem, details: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Box mt={1}>
              <Button startIcon={<AddIcon />} onClick={addItem}>
                เพิ่มรายการ
              </Button>
            </Box>
          </Box>
          <List>
            {serviceItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item.item}
                  secondary={`${formatNumber(item.amount)} บาท - ${
                    item.details
                  }`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting || !!mileageError}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'บันทึก'}
          </Button>
        </DialogActions>
        {isSubmitting && <LinearProgress />}
      </Dialog>

      <Dialog
        open={showNoItemsDialog}
        onClose={() => setShowNoItemsDialog(false)}
      >
        <DialogTitle>แจ้งเตือน</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณากดที่ปุ่มเพิ่มรายการก่อนการบันทึก
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoItemsDialog(false)} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSuccessDialog}>
        <DialogTitle>บันทึกสำเร็จ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            บันทึกรายการสำเร็จ กำลังนำท่านกลับไปยังหน้าหลัก...
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, show: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
