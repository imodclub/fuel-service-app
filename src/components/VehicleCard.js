import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

export default function VehicleCard({ vehicle, onDelete, onRefill }) {
  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
    }}>
      <CardHeader 
        title={`ทะเบียนรถ: ${vehicle.licensePlate}`} 
        sx={{ flexShrink: 0 }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography>ประเภทรถ: {vehicle.vehicleType}</Typography>
        <Typography>ยี่ห้อ: {vehicle.brand}</Typography>
        <Typography>รุ่น: {vehicle.model}</Typography>
        <Typography>CC เครื่องยนต์: {vehicle.engineCC}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', padding: 2, flexShrink: 0 }}>
      <Button variant="contained" color="primary" onClick={onRefill}>
          เติมน้ำมัน
        </Button>
        <Button variant="outlined" color="error" onClick={() => onDelete(vehicle._id)}>
  ลบ
</Button>
      </CardActions>
    </Card>
  );
}