import { useState } from 'react';
import Layout from '../components/Layout';
import { TextField, Button, Typography } from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ส่งข้อมูลไปยัง API เพื่อตรวจสอบการเข้าสู่ระบบ
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    // จัดการการตอบกลับ
  };

  return (
    <Layout>
      <Typography variant="h4">เข้าสู่ระบบ</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          เข้าสู่ระบบ
        </Button>
      </form>
    </Layout>
  );
}