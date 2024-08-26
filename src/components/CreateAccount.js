import { useState } from 'react';
import Layout from '../components/Layout';
import { TextField, Button, Typography } from '@mui/material';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ส่งข้อมูลไปยัง API เพื่อบันทึกใน MongoDB
    const response = await fetch('/api/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    // จัดการการตอบกลับ
  };

  return (
    <Layout>
      <Typography variant="h4">สร้างบัญชี</Typography>
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
          สร้างบัญชี
        </Button>
      </form>
    </Layout>
  );
}