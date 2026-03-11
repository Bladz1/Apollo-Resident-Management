'use client';

import React from 'react';

const RegisterHeader: React.FC = () => {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
        Đăng ký tài khoản
      </h1>
      <p className="mt-3 text-sm text-slate-700 md:text-base">
        Vui lòng cung cấp thông tin chính xác để xác minh danh tính và đảm bảo an toàn dữ liệu.
      </p>
    </div>
  );
};

export default RegisterHeader;
