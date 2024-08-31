import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Collapse,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FuelRefillHistory from './FuelRefillHistory';
import MaintenanceForm from './MaintenanceForm';

export default function VehicleCard({
  vehicle,
  onDelete,
  onRefill,
  refillHistory,
}) {
  const [expanded, setExpanded] = useState(false);
  const [openMaintenanceForm, setOpenMaintenanceForm] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 275, // กำหนดความกว้างขั้นต่ำ
          padding: theme.spacing(2),
          boxSizing: 'border-box',
        }}
      >
        <CardHeader
          title={`ทะเบียนรถ: ${vehicle.licensePlate}`}
          sx={{ textAlign: 'center' }}
        />
        <CardContent>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            ประเภทรถ: {vehicle.vehicleType}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            ยี่ห้อ: {vehicle.brand}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            รุ่น: {vehicle.model}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            CC เครื่องยนต์: {vehicle.engineCC}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
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
    </Grid>
  );
}
