import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BottomSidebar from './BottomSidebar';
import AddVehicleForm from './AddVehicleForm';

const drawerWidth = 240;

const bottomDrawerStyle = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    height: 'auto',
    bottom: 0,
    top: 'auto',
  },
};


export default function Layout({ children }) {
  const [userId, setUserId] = useState(null);
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userId');
    setUserId(null);
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
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
            <>
              <ListItem button component={Link} href="/login">
                <ListItemText primary="เข้าสู่ระบบ" />
              </ListItem>
              <ListItem button component={Link} href="/create-account">
                <ListItemText primary="สร้างบัญชี" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} href="/userdashboard">
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem>
                <Button onClick={handleLogout} color="secondary">
                  ออกจากระบบ
                </Button>
              </ListItem>
              <Button onClick={() => setOpenAddVehicle(true)}>
                เพิ่มข้อมูลรถ
              </Button>
              <Button onClick={handleLogout}>ออกจากระบบ</Button>
            </>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
      <AddVehicleForm
        open={openAddVehicle}
        onClose={() => setOpenAddVehicle(false)}
        userId={userId}
        onVehicleSaved={(newVehicle) => {
          onAddVehicle(newVehicle);
          setOpenAddVehicle(false);
        }}
      />
      <Drawer sx={bottomDrawerStyle} variant="permanent" anchor="bottom">
        <BottomSidebar />
      </Drawer>
    </Box>
  );
}