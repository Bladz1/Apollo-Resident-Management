"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const PASSWORD_REQUIREMENTS = [
  "Ít nhất 8 ký tự",
  "Bao gồm chữ hoa",
  "Bao gồm chữ thường",
  "Bao gồm số",
  "Bao gồm ký tự đặc biệt (!@#$%^&*)",
];

function validatePassword(password: string) {
  const lengthOk = password.length >= 8;
  const upperOk = /[A-Z]/.test(password);
  const lowerOk = /[a-z]/.test(password);
  const numberOk = /[0-9]/.test(password);
  const specialOk = /[!@#$%^&*]/.test(password);

  return {
    lengthOk,
    upperOk,
    lowerOk,
    numberOk,
    specialOk,
    isValid: lengthOk && upperOk && lowerOk && numberOk && specialOk,
  };
}

export default function RegisterPage() {
  const [formState, setFormState] = useState({
    nationalId: "",
    fullName: "",
    address: "",
    phone: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agree: false,
    captcha: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const passwordValidation = useMemo(
    () => validatePassword(formState.password),
    [formState.password],
  );

  const passwordsMatch = formState.password.length > 0 && formState.password === formState.confirmPassword;

  const handleChange = (field: keyof typeof formState) => (value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordValidation.isValid) {
      setStatus("error");
      setMessage("Mật khẩu chưa đáp ứng đủ tiêu chuẩn bảo mật.");
      return;
    }

    if (!passwordsMatch) {
      setStatus("error");
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!formState.agree) {
      setStatus("error");
      setMessage("Bạn cần đồng ý với điều khoản sử dụng và chính sách chia sẻ thông tin.");
      return;
    }

    setStatus("success");
    setMessage(
      "Thông tin đăng ký đã được ghi nhận. Hệ thống sẽ gửi email xác nhận nếu bạn cung cấp địa chỉ email.",
    );
  };

  const handleReset = () => {
    setFormState({
      nationalId: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
      dob: "",
      password: "",
      confirmPassword: "",
      agree: false,
      captcha: "",
    });
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="login-grid" aria-hidden />
        <div className="login-orb orb-top" aria-hidden />
        <div className="login-orb orb-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Đăng ký tài khoản</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Tạo hồ sơ truy cập Cổng Dịch vụ Công</h1>
          <p className="mt-3 text-sm text-slate-200 md:text-base">
            Vui lòng cung cấp thông tin chính xác để xác minh danh tính và đảm bảo an toàn dữ liệu.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-red-900/30 backdrop-blur-xl md:grid-cols-2"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="national-id" className="text-sm font-semibold text-slate-100">
                Số CCCD <span className="text-amber-300">*</span>
              </label>
              <input
                id="national-id"
                type="text"
                inputMode="numeric"
                pattern="\\d{12}"
                title="Số CCCD gồm 12 chữ số"
                required
                value={formState.nationalId}
                onChange={(event) => handleChange("nationalId")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="012345678901"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="full-name" className="text-sm font-semibold text-slate-100">
                Họ và tên <span className="text-amber-300">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={formState.fullName}
                onChange={(event) => handleChange("fullName")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-semibold text-slate-100">
                Nơi ở hiện tại <span className="text-amber-300">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                value={formState.address}
                onChange={(event) => handleChange("address")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="Số nhà, đường, phường/xã, quận/huyện"
                autoComplete="street-address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-semibold text-slate-100">
                Số điện thoại <span className="text-amber-300">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                pattern="(0|\+84)[0-9]{9,10}"
                required
                value={formState.phone}
                onChange={(event) => handleChange("phone")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="0987654321"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-slate-100">
                Email (nếu có)
              </label>
              <input
                id="email"
                type="email"
                value={formState.email}
                onChange={(event) => handleChange("email")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="nguoidung@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="dob" className="text-sm font-semibold text-slate-100">
                Ngày tháng năm sinh <span className="text-amber-300">*</span>
              </label>
              <input
                id="dob"
                type="date"
                required
                value={formState.dob}
                onChange={(event) => handleChange("dob")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                autoComplete="bday"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-slate-100">
                Mật khẩu <span className="text-amber-300">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={formState.password}
                onChange={(event) => handleChange("password")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
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
                            ? 'border-emerald-300 bg-emerald-500/20 text-emerald-200'
                            : 'border-white/20 bg-white/5 text-slate-300'
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
              <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-100">
                Xác nhận mật khẩu <span className="text-amber-300">*</span>
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={formState.confirmPassword}
                onChange={(event) => handleChange("confirmPassword")(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {formState.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-2 text-xs text-rose-300">Mật khẩu xác nhận chưa khớp.</p>
              )}
            </div>

            <div>
              <label htmlFor="captcha" className="text-sm font-semibold text-slate-100">
                Mã xác nhận CAPTCHA <span className="text-amber-300">*</span>
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex h-12 items-center justify-center rounded-lg bg-slate-800/80 px-6 text-lg font-semibold tracking-[0.35em] text-amber-200 shadow-inner shadow-black/30">
                  7K4P
                </div>
                <input
                  id="captcha"
                  type="text"
                  required
                  value={formState.captcha}
                  onChange={(event) => handleChange("captcha")(event.target.value.toUpperCase())}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm uppercase tracking-[0.3em] text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60 md:flex-none md:w-40"
                  placeholder="Nhập mã"
                  autoComplete="off"
                />
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Nhập mã hiển thị bên cạnh để xác thực. Mã sẽ thay đổi sau mỗi lần làm mới trang.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.agree}
                  onChange={(event) => handleChange("agree")(event.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/30 bg-slate-950/80 text-amber-400 focus:ring-amber-400"
                />
                <span>
                  Tôi đồng ý với{' '}
                  <Link href="#" className="font-semibold text-amber-200 hover:text-amber-100">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link href="#" className="font-semibold text-amber-200 hover:text-amber-100">
                    Chính sách chia sẻ thông tin
                  </Link>{' '}
                  của Cổng Dịch vụ Công.
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 md:flex-none md:px-8"
              >
                Gửi đăng ký
              </button>
              <button
                type="reset"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
              >
                Nhập lại
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:border-amber-100 hover:text-amber-100"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
              <p
                className={`font-semibold ${
                  status === 'success'
                    ? 'text-emerald-200'
                    : status === 'error'
                    ? 'text-rose-200'
                    : 'text-slate-200'
                }`}
              >
                {status === 'idle' ? 'Vui lòng điền đầy đủ thông tin trước khi gửi đăng ký.' : message}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
