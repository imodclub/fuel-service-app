import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ตรวจสอบค่าว่างและช่องว่างในชื่อผู้ใช้
    if (!username || !password || username.trim() !== username) {
      setError('ชื่อผู้ใช้และรหัสผ่านต้องไม่เป็นค่าว่าง และชื่อผู้ใช้ต้องไม่มีช่องว่าง');
      return;
    }

    // ตรวจสอบรหัสผ่านตรงกัน
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

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // รอสักครู่แล้วนำทางไปหน้า login
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.includes(' ')) {
      setError('ชื่อผู้ใช้ต้องไม่มีช่องว่าง');
    } else {
      setError('');
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          สร้างบัญชี
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="ชื่อผู้ใช้"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            margin="normal"
            required
            error={!!error && error.includes('ชื่อผู้ใช้')}
            helperText={error && error.includes('ชื่อผู้ใช้') ? error : ''}
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
    </Layout>
  );
}