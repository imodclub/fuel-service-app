import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Collapse, Box } from '@mui/material';
import Layout from '../components/Layout';

const MaintenanceInfo = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found');
          return;
        }
        const response = await fetch(`/api/maintenance-records?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setMaintenanceRecords(data);
        } else {
          console.error('Failed to fetch maintenance records');
        }
      } catch (error) {
        console.error('Error fetching maintenance records:', error);
      }
    };

    fetchMaintenanceRecords();
  }, []);

  const handleExpandClick = (recordId) => {
    setExpanded(expanded === recordId ? null : recordId);
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>ข้อมูลการบำรุงรักษา</Typography>
        {maintenanceRecords.map((record) => (
          <Card key={record._id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">วันที่บำรุงรักษา: {new Date(record.date).toLocaleDateString()}</Typography>
              <Typography variant="body2">
                ประเภท: {record.type}
              </Typography>
              <Typography variant="body2">
                ค่าใช้จ่าย: {record.cost} บาท
              </Typography>
              <Button onClick={() => handleExpandClick(record._id)} sx={{ mt: 1 }}>
                {expanded === record._id ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียด'}
              </Button>
              <Collapse in={expanded === record._id} timeout="auto" unmountOnExit>
                <Typography paragraph sx={{ mt: 2 }}>
                  รายละเอียด: {record.description}
                </Typography>
                <Typography paragraph>
                  เลขไมล์: {record.mileage} กม.
                </Typography>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Layout>
  );
};

export default MaintenanceInfo;