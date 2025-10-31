'use client';

import { useRouter } from 'next/navigation';

export default function SupportButton() {
  const router = useRouter();

  const navigateToSupport = () => {
    router.push('/#support');
  };

  return (
    <button onClick={navigateToSupport} className="hover:text-yellow-200">
      Hỗ trợ
    </button>
  );
}
