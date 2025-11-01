'use client';

import { useRouter } from 'next/navigation';

export default function SupportButton() {
  const router = useRouter();

  const navigateToSupport = () => {

    router.push('/');

    setTimeout(() => {
      const supportElement = document.getElementById('support');
      if (supportElement) {
        supportElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <button onClick={navigateToSupport} className="hover:text-yellow-200">
      Hỗ trợ
    </button>
  );
}
