'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  extractRolesFromToken,
  loadAuth,
  loadUserId,
  loadUsername,
} from '@/utils/auth-storage';

type SensitiveFieldKey = 'personalId' | 'phone';

const ProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [visibleFields, setVisibleFields] = useState<Record<SensitiveFieldKey, boolean>>({
    personalId: false,
    phone: false,
  });
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timersRef = useRef<Partial<Record<SensitiveFieldKey, ReturnType<typeof setTimeout>>>>(
    {},
  );

  useEffect(() => {
    const stored = loadAuth();
    setUsername(loadUsername());
    setUserId(loadUserId());
    setRoles(extractRolesFromToken(stored?.token ?? null) ?? []);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const isAdmin = useMemo(
    () => roles.some((role) => role.toUpperCase().includes('ADMIN')),
    [roles],
  );
  const roleLabel = isAdmin
    ? 'Quản trị viên'
    : roles.length > 0
      ? roles.join(', ')
      : 'Người dùng';

  const personalIdValue = userId ?? '0362123456789';
  const phoneValue = '0559123456';

  const maskValue = (value: string, visibleCount = 3) => {
    if (value.length <= visibleCount * 2) {
      return `${value.slice(0, visibleCount)}••••`;
    }
    return `${value.slice(0, visibleCount)}${'•'.repeat(
      Math.max(value.length - visibleCount * 2, 4),
    )}${value.slice(-visibleCount)}`;
  };

  const handleRevealField = (field: SensitiveFieldKey) => {
    setVisibleFields((prev) => {
      const nextValue = !prev[field];
      if (nextValue) {
        if (timersRef.current[field]) {
          clearTimeout(timersRef.current[field]);
        }
        timersRef.current[field] = setTimeout(() => {
          setVisibleFields((current) => ({ ...current, [field]: false }));
        }, 60000);
      } else if (timersRef.current[field]) {
        clearTimeout(timersRef.current[field]);
      }
      return { ...prev, [field]: nextValue };
    });
  };

  const handleToggleSensitive = () => {
    const shouldReveal = !visibleFields.personalId || !visibleFields.phone;
    setVisibleFields({
      personalId: shouldReveal,
      phone: shouldReveal,
    });
    (['personalId', 'phone'] as SensitiveFieldKey[]).forEach((field) => {
      if (shouldReveal) {
        if (timersRef.current[field]) {
          clearTimeout(timersRef.current[field]);
        }
        timersRef.current[field] = setTimeout(() => {
          setVisibleFields((current) => ({ ...current, [field]: false }));
        }, 60000);
      } else if (timersRef.current[field]) {
        clearTimeout(timersRef.current[field]);
      }
    });
  };

  const handleCopy = async (field: SensitiveFieldKey, value: string) => {
    if (!visibleFields[field]) {
      setToastMessage('Vui lòng bật hiển thị trước khi sao chép.');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setToastMessage('Đã sao chép thông tin.');
    } catch (error) {
      setToastMessage('Không thể sao chép, vui lòng thử lại.');
    }
  };

  const addressValue =
    'Số 45, đường Nguyễn Trãi, phường Bến Thành, quận 1, TP. Hồ Chí Minh, Việt Nam';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <span aria-hidden className="text-lg">
              ←
            </span>
            Thông tin cá nhân
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full p-2 text-gray-700 transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              aria-label="Mở tiện ích QR"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path
                  d="M4 4h6v6H4V4Zm0 10h6v6H4v-6Zm10-10h6v6h-6V4Zm0 10h3v3h-3v-3Zm3 3h3v3h-3v-3Zm0-6h3v3h-3v-3Z"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {username ? (
              <div className="hidden items-center gap-2 md:flex">
                <Image
                  src="/images/7.png"
                  alt="Ảnh đại diện"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-white object-cover shadow"
                />
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-[#f6efe6] via-[#f9f2e9] to-[#faf8f5]">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute left-0 top-6 h-40 w-64"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='320' height='160' viewBox='0 0 320 160' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60C40 20 80 20 120 60C160 100 200 100 240 60C280 20 320 20 360 60' stroke='%23A17842' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M0 110C40 70 80 70 120 110C160 150 200 150 240 110C280 70 320 70 360 110' stroke='%23A17842' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute right-0 top-4 h-40 w-64"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='320' height='160' viewBox='0 0 320 160' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60C40 20 80 20 120 60C160 100 200 100 240 60C280 20 320 20 360 60' stroke='%23A17842' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M0 110C40 70 80 70 120 110C160 150 200 150 240 110C280 70 320 70 360 110' stroke='%23A17842' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
        <div className="mx-auto flex w-full max-w-[1120px] flex-col justify-center px-4 py-16 sm:px-6 md:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9b7a4a]">Hồ sơ cá nhân</p>
          <h1 className="mt-3 text-3xl font-bold text-[#3f2a19] md:text-4xl">
            Thông tin tài khoản
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#7a6246]">
            Giữ đúng chất ứng dụng mobile với vùng nền hoạ tiết, đồng thời tối ưu bố cục đọc
            nhanh trên desktop.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-4 pb-12 sm:px-6">
        <div className="-mt-16 grid gap-6 min-[992px]:grid-cols-[380px_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="-mt-16 flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md md:h-24 md:w-24">
                <Image
                  src="/images/7.png"
                  alt="Ảnh đại diện"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-2xl font-semibold uppercase tracking-[0.05em] text-[#3f2a19]">
                {username ?? 'Khách truy cập'}
              </h2>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
                Định danh mức 1
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                  ✓
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{roleLabel}</p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleCopy('personalId', personalIdValue)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Sao chép số định danh
                <span aria-hidden>⧉</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Tải PDF thông tin
                <span aria-hidden>⬇</span>
              </button>
              <button
                type="button"
                onClick={handleToggleSensitive}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {visibleFields.personalId || visibleFields.phone
                  ? 'Ẩn dữ liệu nhạy cảm'
                  : 'Hiện dữ liệu nhạy cảm'}
                <span aria-hidden>{visibleFields.personalId || visibleFields.phone ? '🙈' : '👁️'}</span>
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#faf8f5] p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-800">Trạng thái</p>
              <p className="mt-2">Đã xác thực định danh cơ bản.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#3f2a19]">Thông tin</h3>
                <span className="text-xs text-gray-400">Cập nhật theo phiên</span>
              </div>

              <div className="mt-4 divide-y divide-gray-100 text-sm">
                <div className="flex flex-col gap-3 py-4 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
                  <div className="text-sm text-gray-500">Số định danh cá nhân</div>
                  <div className="flex items-center gap-3 min-[992px]:justify-end">
                    <span className="text-[15px] font-medium text-gray-900">
                      {visibleFields.personalId ? personalIdValue : maskValue(personalIdValue, 4)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRevealField('personalId')}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      {visibleFields.personalId ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('personalId', personalIdValue)}
                      className="rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      aria-label="Sao chép số định danh"
                    >
                      ⧉
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-4 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
                  <div className="text-sm text-gray-500">Giới tính</div>
                  <div className="text-[15px] font-medium text-gray-900 min-[992px]:text-right">
                    Nam
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-4 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
                  <div className="text-sm text-gray-500">Ngày sinh</div>
                  <div className="text-[15px] font-medium text-gray-900 min-[992px]:text-right">
                    12/09/1994
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-4 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="flex items-center gap-3 min-[992px]:justify-end">
                    <span className="text-[15px] font-medium text-gray-900">
                      {visibleFields.phone ? phoneValue : maskValue(phoneValue, 3)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRevealField('phone')}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      {visibleFields.phone ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('phone', phoneValue)}
                      className="rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      aria-label="Sao chép số điện thoại"
                    >
                      ⧉
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-4 min-[992px]:flex-row min-[992px]:items-start min-[992px]:justify-between">
                  <div className="text-sm text-gray-500">Nơi thường trú</div>
                  <div className="min-[992px]:max-w-[60%] min-[992px]:text-right">
                    <p
                      className={`text-[15px] font-medium text-gray-900 ${
                        isAddressExpanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {addressValue}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddressExpanded((prev) => !prev)}
                      className="mt-2 text-xs font-semibold text-red-700 hover:text-red-800"
                    >
                      {isAddressExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-[#3f2a19]">
                Lưu ý bảo mật
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Dữ liệu nhạy cảm được ẩn mặc định và chỉ hiển thị trong thời gian ngắn sau khi
                xác nhận.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Dịch vụ của tôi
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-full bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                  >
                    Bảng quản trị
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-40 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
