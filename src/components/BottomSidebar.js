import { List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';

const bottomMenuItems = [
  { text: 'เกี่ยวกับเรา', href: '/about' },
  { text: 'ติดต่อ', href: '/contact' },
  { text: 'ช่วยเหลือ', href: '/help' },
];

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