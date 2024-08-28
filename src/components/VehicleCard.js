import { Card, CardHeader, CardContent, CardActions, Button, Typography, Collapse } from '@mui/material';
import { useState } from 'react';
import FuelRefillHistory from './FuelRefillHistory';

export default function VehicleCard({ vehicle, onDelete, onRefill, refillHistory }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardHeader title={`ทะเบียนรถ: ${vehicle.licensePlate}`} />
      <CardContent>
        <Typography>ประเภทรถ: {vehicle.vehicleType}</Typography>
        <Typography>ยี่ห้อ: {vehicle.brand}</Typography>
        <Typography>รุ่น: {vehicle.model}</Typography>
        <Typography>CC เครื่องยนต์: {vehicle.engineCC}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={onRefill}>
          เติมน้ำมัน
        </Button>
        <Button variant="outlined" color="error" onClick={onDelete}>
          ลบ
        </Button>
        <Button
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show history"
        >
          {expanded ? 'ซ่อนประวัติ' : 'แสดงประวัติ'}
        </Button>
      </CardActions>
    </Card>
  );
}