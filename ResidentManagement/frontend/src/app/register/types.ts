'use client';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/resident-management";
export const VN_PHONE_REGEX = /^(0[3|5|7|8|9][0-9]{8}|\+84[3|5|7|8|9][0-9]{8})$/;

export const PASSWORD_REQUIREMENTS = [
  "Ít nhất 8 ký tự",
  "Bao gồm chữ hoa",
  "Bao gồm chữ thường",
  "Bao gồm số",
  "Bao gồm ký tự đặc biệt (!@#$%^&*)",
];

export function validatePassword(password: string) {
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

export type RegisterFormState = {
  nationalId: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  captcha: string;
};
