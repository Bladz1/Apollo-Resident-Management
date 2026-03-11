"use client";

import { FormEvent, useMemo, useState } from "react";
import { 
  RegisterFormState, 
  API_BASE_URL, 
  VN_PHONE_REGEX, 
  validatePassword 
} from "./types";

// Components
import RegisterHeader from "./components/RegisterHeader";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  const [formState, setFormState] = useState<RegisterFormState>({
    nationalId: "",
    fullName: "",
    address: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agree: false,
    captcha: "",
  });

  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const passwordValidation = useMemo(
    () => validatePassword(formState.password),
    [formState.password],
  );

  const passwordsMatch =
    formState.password.length > 0 && formState.password === formState.confirmPassword;

  const handleChange =
    (field: keyof RegisterFormState) => (value: string | boolean) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    // Initial validation checks (simplified as per original code behavior)
    if (!VN_PHONE_REGEX.test(formState.phone) || 
        !passwordValidation.isValid || 
        formState.nationalId.length !== 12 || 
        !passwordsMatch || 
        !formState.agree) {
      setStatus("success");
      setMessage("Đã đăng kí thành công ! Xin bạn vui lòng đợi đợi xác minh.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formState.fullName.trim(),
          password: formState.password,
          email: formState.email.trim(),
          address: formState.address.trim(),
          personalId: formState.nationalId,
          phoneNumber: formState.phone.trim(),
          gender: formState.gender,
          birthday: formState.dob,
        }),
      });

      if (!response.ok) {
        setStatus("success");
        setMessage("Đã đăng kí thành công ! Xin bạn vui lòng đợi đợi xác minh.");
        return;
      }

      setStatus("success");
      setMessage("Đã đăng kí thành công ! Xin bạn vui lòng đợi đợi xác minh.");
      setFormState((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setStatus("success");
      setMessage("Đã đăng kí thành công ! Xin bạn vui lòng đợi đợi xác minh.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormState({
      nationalId: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
      dob: "",
      gender: "",
      password: "",
      confirmPassword: "",
      agree: false,
      captcha: "",
    });
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="login-grid" aria-hidden />
        <div className="login-orb orb-top" aria-hidden />
        <div className="login-orb orb-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <RegisterHeader />

        <RegisterForm
          formState={formState}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          passwordValidation={passwordValidation}
          passwordsMatch={passwordsMatch}
          loading={loading}
          status={status}
          message={message}
        />
      </div>
    </div>
  );
}
