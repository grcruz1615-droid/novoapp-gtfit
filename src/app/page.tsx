'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para login na página inicial
    router.push('/login');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0D0D0D]">
      <div className="text-white text-xl font-inter">Carregando GTFit...</div>
    </div>
  );
}
