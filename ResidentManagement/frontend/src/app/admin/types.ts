'use client';

import { TOKEN_KEY } from '@/utils/auth-storage';

export const feeCategories = [
  {
    id: 'health-social',
    label: 'Phí y tế - xã hội',
    description: 'Bao gồm quỹ y tế, hỗ trợ xã hội, và chăm sóc cộng đồng.',
  },
  {
    id: 'administrative',
    label: 'Phí hành chính công',
    description: 'Lệ phí cấp giấy tờ, đăng ký dịch vụ công và xác thực hồ sơ.',
  },
  {
    id: 'transport',
    label: 'Phí giao thông',
    description: 'Phí đường bộ, phương tiện công cộng, và hạ tầng giao thông.',
  },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/resident-management';

export type FeedbackStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type Complaint = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: FeedbackStatus;
  title?: string;
  description?: string;
  content?: string;
  attachmentUrl?: string;
  createdAt?: string;
};

export type UserRegisterStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type PendingUser = {
  id: string;
  personalId: string;
  fullName: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  status: UserRegisterStatus;
  email?: string;
};

export type UserResponse = {
  id: string;
  fullName: string;
  gender?: string;
  birthday?: string;
  email: string;
  personalId?: string;
  phoneNumber?: string;
  address?: string;
  status?: UserRegisterStatus;
  password?: string;
  rawPassword?: string;
  roles?: { name: string }[];
};

export type FeeRecord = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  amount: string;
  dueDate: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  result: T;
};

export type SystemNewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  version: string;
  createdAt: string;
};

export const buildAuthHeaders = (base: Record<string, string>) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const headers: Record<string, string> = { ...base };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const formatToLocalDate = (value: string) => {
  return value.slice(0, 10);
};
