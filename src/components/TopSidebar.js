import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home, PersonAdd, Login, Dashboard } from '@mui/icons-material';
import Link from 'next/link';

const menuItems = [
  { text: 'หน้าหลัก', icon: <Home />, href: '/' },
  { text: 'สร้างบัญชี', icon: <PersonAdd />, href: '/create-account' },
  { text: 'เข้าสู่ระบบ', icon: <Login />, href: '/login' },
  { text: 'แดชบอร์ด', icon: <Dashboard />, href: '/userdashboard' },
];

export default function TopSidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <Link href={item.href} key={item.text} passHref>
            <ListItem button component="a">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}