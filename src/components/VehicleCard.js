import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

export default function VehicleCard({ vehicle, onDelete }) {
  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardHeader title={`ทะเบียนรถ: ${vehicle.licensePlate}`} />
      <CardContent>
        <Typography>ประเภทรถ: {vehicle.vehicleType}</Typography>
        <Typography>ยี่ห้อ: {vehicle.brand}</Typography>
        <Typography>รุ่น: {vehicle.model}</Typography>
        <Typography>CC เครื่องยนต์: {vehicle.engineCC}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary">
          เติมน้ำมัน
        </Button>
        <Button variant="outlined" color="error" onClick={onDelete}>
          ลบ
        </Button>
      </CardActions>
    </Card>
  );
}
