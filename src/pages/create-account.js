import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setOpenDialog(true);
      } else {
        const data = await response.json();
        setError(data.message || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    router.push('/login');
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          สร้างบัญชี
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="ยืนยันรหัสผ่าน"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            สร้างบัญชี
          </Button>
        </form>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ลงทะเบียนสำเร็จ</DialogTitle>
        <DialogContent>
          <Typography>บัญชีของคุณถูกสร้างเรียบร้อยแล้ว</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}