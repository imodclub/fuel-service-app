import { List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

const bottomMenuItems = [
  { text: 'โปรไฟล์', href: 'profile'},
  { text: 'เกี่ยวกับเรา', href: '/about' },
  { text: 'ติดต่อ', href: '/contact' },
  { text: 'ช่วยเหลือ', href: '/help' },
];

const bottomDrawerStyle = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    height: 'auto', // This will make the drawer height fit its content
    bottom: 0, // This will position the drawer at the bottom
    top: 'auto', // This ensures the drawer doesn't start from the top
  },
};

export default function BottomSidebar() {
  return (
    <List>
      {bottomMenuItems.map((item) => (
        <ListItem button component={Link} href={item.href} key={item.text}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
}

