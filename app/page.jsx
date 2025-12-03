'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('hosthub_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, []);

  return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;
}
