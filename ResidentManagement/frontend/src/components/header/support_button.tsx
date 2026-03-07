'use client';

import Link from 'next/link';

export default function SupportButton() {
  return (
    <Link href="/#support" className="hover:text-yellow-200">
      Hỗ trợ
    </Link>
  );
}
