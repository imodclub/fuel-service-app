import { useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button, Collapse } from '@mui/material';

export default function FuelRefillHistory({ vehicleId, refillHistory }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // ตรวจสอบว่า refillHistory เป็น array และมีข้อมูล
  const hasRefillHistory = Array.isArray(refillHistory) && refillHistory.length > 0;

  const recentRefills = hasRefillHistory ? refillHistory.slice(0, 3) : [];
  const olderRefills = hasRefillHistory ? refillHistory.slice(3) : [];

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        ประวัติการเติมน้ำมัน
      </Typography>
      {hasRefillHistory ? (
        <>
          <List>
            {recentRefills.map((refill, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`วันที่: ${new Date(refill.refillDate).toLocaleDateString()}`}
                  secondary={`ราคา: ${refill.totalPrice} บาท, ระยะทาง: ${refill.mileage} กม.`}
                />
              </ListItem>
            ))}
          </List>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List>
              {olderRefills.map((refill, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`วันที่: ${new Date(refill.refillDate).toLocaleDateString()}`}
                    secondary={`ราคา: ${refill.totalPrice} บาท, ระยะทาง: ${refill.mileage} กม.`}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
          {refillHistory.length > 3 && (
            <Button onClick={toggleExpand}>
              {expanded ? 'แสดงน้อยลง' : 'ดูเพิ่มเติม'}
            </Button>
          )}
        </>
      ) : (
        <Typography>ไม่มีประวัติการเติมน้ำมัน</Typography>
      )}
    </Paper>
  );
}