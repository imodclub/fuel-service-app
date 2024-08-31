import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import FuelRefillHistory from './FuelRefillHistory';
import MaintenanceForm from './MaintenanceForm'; // เพิ่มการ import

export default function VehicleCard({
  vehicle,
  onDelete,
  onRefill,
  refillHistory,
}) {
  const [expanded, setExpanded] = useState(false);
  const [openMaintenanceForm, setOpenMaintenanceForm] = useState(false); // เพิ่ม state

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
        
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenMaintenanceForm(true)}
        >
          เพิ่มการบำรุงรักษา
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <FuelRefillHistory refillHistory={refillHistory} />
        </CardContent>
      </Collapse>
      <MaintenanceForm
        open={openMaintenanceForm}
        onClose={() => setOpenMaintenanceForm(false)}
        vehicleId={vehicle._id}
      />
    </Card>
  );
}
