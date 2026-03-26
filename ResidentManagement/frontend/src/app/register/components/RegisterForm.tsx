'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { RegisterFormState, PASSWORD_REQUIREMENTS } from '../types';

type RegisterFormProps = {
  formState: RegisterFormState;
  handleChange: (field: keyof RegisterFormState) => (value: string | boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleReset: () => void;
  passwordValidation: {
    lengthOk: boolean;
    upperOk: boolean;
    lowerOk: boolean;
    numberOk: boolean;
    specialOk: boolean;
    isValid: boolean;
  };
  passwordsMatch: boolean;
  loading: boolean;
  status: 'idle' | 'success';
  message: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  formState,
  handleChange,
  handleSubmit,
  handleReset,
  passwordValidation,
  passwordsMatch,
  loading,
  status,
  message,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:grid-cols-2"
    >
      {/* CỘT TRÁI */}
      <div className="space-y-5">
        <div>
          <label htmlFor="national-id" className="text-sm font-semibold text-slate-700">
            Số CCCD <span className="text-red-900">*</span>
          </label>
          <input
            id="national-id"
            type="text"
            inputMode="numeric"
            required
            minLength={12}
            maxLength={12}
            value={formState.nationalId}
            onChange={(e) => {
              const onlyAsciiDigits = e.target.value.replace(/[^0-9]/g, '');
              handleChange('nationalId')(onlyAsciiDigits.slice(0, 12));
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            autoComplete="off"
          />
          {formState.nationalId.length > 0 && formState.nationalId.length < 12 && (
            <p className="mt-2 text-xs text-rose-600">Số CCCD cần đủ 12 chữ số.</p>
          )}
        </div>

        <div>
          <label htmlFor="full-name" className="text-sm font-semibold text-slate-700">
            Họ và tên <span className="text-red-900">*</span>
          </label>
          <input
            id="full-name"
            type="text"
            required
            value={formState.fullName}
            onChange={(event) => handleChange('fullName')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            placeholder=""
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="address" className="text-sm font-semibold text-slate-700">
            Nơi ở hiện tại <span className="text-red-900">*</span>
          </label>
          <input
            id="address"
            type="text"
            required
            value={formState.address}
            onChange={(event) => handleChange('address')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            placeholder=""
            autoComplete="street-address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
            Số điện thoại <span className="text-red-900">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formState.phone}
            onChange={(event) => handleChange('phone')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            placeholder=""
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email (nếu có)
          </label>
          <input
            id="email"
            type="email"
            value={formState.email}
            onChange={(event) => handleChange('email')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            placeholder=""
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="dob" className="text-sm font-semibold text-slate-700">
            Ngày tháng năm sinh <span className="text-red-900">*</span>
          </label>
          <input
            id="dob"
            type="date"
            required
            value={formState.dob}
            onChange={(event) => handleChange('dob')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
            autoComplete="bday"
          />
        </div>

        <div>
          <label htmlFor="gender" className="text-sm font-semibold text-slate-700">
            Giới tính <span className="text-red-900">*</span>
          </label>
          <select
            id="gender"
            required
            value={formState.gender}
            onChange={(event) => handleChange('gender')(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
          >
            <option value="" disabled>
              Chọn giới tính
            </option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="space-y-5">
        <div>
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Mật khẩu <span className="text-red-900">*</span>
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formState.password}
              onChange={(event) => handleChange('password')(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
              placeholder=""
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            {PASSWORD_REQUIREMENTS.map((requirement, index) => {
              const checks = [
                passwordValidation.lengthOk,
                passwordValidation.upperOk,
                passwordValidation.lowerOk,
                passwordValidation.numberOk,
                passwordValidation.specialOk,
              ];
              const isMet = checks[index];

              return (
                <li key={requirement} className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                      isMet
                        ? 'border-emerald-300 bg-emerald-500/20 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {isMet ? '✓' : '•'}
                  </span>
                  <span>{requirement}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700">
            Xác nhận mật khẩu <span className="text-red-900">*</span>
          </label>
          <div className="relative mt-2">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formState.confirmPassword}
              onChange={(event) => handleChange('confirmPassword')(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
              placeholder=""
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formState.confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-xs text-rose-600">Mật khẩu xác nhận chưa khớp.</p>
          )}
        </div>

        <div className="rounded-2xl p-4 text-xs text-slate-700">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formState.agree}
              onChange={(event) => handleChange('agree')(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-400"
            />
            <span>
              Tôi đồng ý với{' '}
              <Link href="#" className="font-semibold text-black">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link href="#" className="font-semibold text-black">
                Chính sách chia sẻ thông tin
              </Link>{' '}
              của Cổng Dịch vụ Công.
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
          <p className={`font-semibold ${status === 'success' ? 'text-emerald-700' : 'text-slate-700'}`}>
            {status === 'idle' ? 'Vui lòng điền đầy đủ thông tin trước khi gửi đăng ký.' : message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 md:flex-none md:px-8"
          >
            {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-amber-300 px-6 py-3 text-sm font-semibold text-amber-700 transition hover:border-amber-200 hover:text-amber-600"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
