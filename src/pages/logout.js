import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      // ลบ session และ cookie
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // ลบข้อมูลใน localStorage
      localStorage.clear();

      // เรียก API เพื่อล็อกเอาท์ (ถ้ามี)
      try {
        await fetch('/api/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout error:', error);
      }

      // Redirect ไปยังหน้าแรก
      router.push('/');
    };

    performLogout();
  }, [router]);

  return <div>Logging out...</div>;
}