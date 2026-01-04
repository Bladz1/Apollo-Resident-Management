'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  extractRolesFromToken,
  loadAuth,
  loadUserId,
  loadUsername,
} from '@/utils/auth-storage';

const ProfilePage = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const stored = loadAuth();
    setUsername(loadUsername());
    setUserId(loadUserId());
    setRoles(extractRolesFromToken(stored?.token ?? null) ?? []);
  }, []);

  const isAdmin = useMemo(
    () => roles.some((role) => role.toUpperCase().includes('ADMIN')),
    [roles],
  );
  const roleLabel = isAdmin
    ? 'Quản trị viên'
    : roles.length > 0
      ? roles.join(', ')
      : 'Người dùng';

  const isAuthenticated = Boolean(username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-3xl bg-white shadow-lg">
          <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-red-800 via-red-900 to-yellow-600 px-6 py-10 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-yellow-100">Hồ sơ cá nhân</p>
            <h1 className="mt-3 text-3xl font-bold">Thông tin tài khoản</h1>
            <p className="mt-2 max-w-xl text-sm text-yellow-100">
              Quản lý thông tin đăng nhập, vai trò và các tùy chọn cá nhân ngay tại đây.
            </p>
            <div className="absolute -bottom-10 right-8 hidden h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg md:block">
              <Image
                src="/images/7.png"
                alt="Ảnh đại diện"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-yellow-200 shadow-md md:hidden">
                <Image
                  src="/images/7.png"
                  alt="Ảnh đại diện"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Xin chào</p>
                <h2 className="text-2xl font-semibold text-red-900">
                  {username ?? 'Khách truy cập'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{roleLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/services"
                    className="rounded-full border border-red-700 px-5 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50"
                  >
                    Dịch vụ của tôi
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                    >
                      Bảng quản trị
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  Đăng nhập để cập nhật
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-red-900">Thông tin cơ bản</h3>
            <dl className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <dt className="font-medium">Tên đăng nhập</dt>
                <dd>{username ?? 'Chưa đăng nhập'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <dt className="font-medium">Mã người dùng</dt>
                <dd>{userId ?? 'Đang cập nhật'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">Vai trò</dt>
                <dd>{roleLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-red-900">Gợi ý nhanh</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />
                Kiểm tra lại thông tin hồ sơ và cập nhật khi có thay đổi.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                Liên hệ bộ phận hỗ trợ nếu cần cấp thêm quyền truy cập.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-300" />
                Theo dõi thông báo mới từ hệ thống để không bỏ lỡ cập nhật quan trọng.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-red-800 via-red-900 to-yellow-700 px-6 py-8 text-white shadow-lg">
          <h3 className="text-xl font-semibold">Bảo mật tài khoản</h3>
          <p className="mt-2 max-w-2xl text-sm text-yellow-100">
            Luôn bảo mật thông tin đăng nhập và không chia sẻ mật khẩu với người khác.
            Hệ thống sẽ tự động đăng xuất nếu phát hiện hoạt động bất thường.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#support"
              className="rounded-full border border-yellow-200 px-5 py-2 text-sm font-semibold text-white transition hover:bg-yellow-200/20"
            >
              Trung tâm hỗ trợ
            </Link>
            <Link
              href="/news"
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Tin tức mới nhất
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
