import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 240;

export default function Layout({ children }) {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ userId ใน Local Storage เมื่อ component ถูกโหลด
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleLogout = async () => {
    // ลบ userId จาก Local Storage
    localStorage.removeItem('userId');
    setUserId(null);

    // ลบ cookie
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    // เรียก API เพื่อทำลาย session ที่ server (ถ้ามี)
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // นำทางกลับไปยังหน้าหลัก
    router.push('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {!userId ? (
            // แสดงเมื่อไม่มี userId
            <>
              <ListItem button component={Link} href="/login">
                <ListItemText primary="เข้าสู่ระบบ" />
              </ListItem>
              <ListItem button component={Link} href="/create-account">
                <ListItemText primary="สร้างบัญชี" />
              </ListItem>
            </>
          ) : (
            // แสดงเมื่อมี userId
            <>
              <ListItem button component={Link} href="/dashboard">
                <ListItemText primary="User Dashboard" />
              </ListItem>
              <ListItem>
                <Button onClick={handleLogout} color="secondary">ออกจากระบบ</Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}