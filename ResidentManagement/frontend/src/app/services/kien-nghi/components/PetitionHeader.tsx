'use client';

import React from 'react';
import Link from 'next/link';

type PetitionHeaderProps = {
  petitionServiceName?: string;
  petitionServiceDescription?: string;
};

const PetitionHeader: React.FC<PetitionHeaderProps> = ({
  petitionServiceName,
  petitionServiceDescription,
}) => {
  return (
    <header className="border-b border-slate-200 bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-100">
            Gửi kiến nghị trực tuyến
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            {petitionServiceName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-red-50 md:text-base">
            {petitionServiceDescription}
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center justify-center rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          ← Quay lại trang dịch vụ
        </Link>
      </div>
    </header>
  );
};

export default PetitionHeader;
