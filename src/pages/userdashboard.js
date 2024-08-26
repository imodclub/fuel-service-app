import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Typography, Box } from '@mui/material';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {userId && (
          <Typography>
            ยินดีต้อนรับ! User ID ของคุณคือ: {userId}
          </Typography>
        )}
      </Box>
    </Layout>
  );
}