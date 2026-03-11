'use client';

import React from 'react';
import type { PetitionFormState } from '../../data';
import RichTextEditor from './RichTextEditor';

type PetitionFormProps = {
  petitionState: PetitionFormState;
  handlePetitionChange: <Field extends keyof PetitionFormState>(field: Field, value: PetitionFormState[Field]) => void;
  handlePetitionSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handlePetitionReset: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  handleEditorInput: () => void;
  petitionMessage: string;
};

const PetitionForm: React.FC<PetitionFormProps> = ({
  petitionState,
  handlePetitionChange,
  handlePetitionSubmit,
  handlePetitionReset,
  editorRef,
  handleEditorInput,
  petitionMessage,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
      <form className="space-y-6" onSubmit={handlePetitionSubmit} onReset={handlePetitionReset}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Họ và tên <span className="text-red-500">*</span>
            </span>
            <input
              required
              placeholder="Nhập họ và tên..."
              value={petitionState.fullName}
              onChange={(e) => handlePetitionChange('fullName', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Địa chỉ Email <span className="text-red-500">*</span>
            </span>
            <input
              required
              type="email"
              placeholder="Nhập địa chỉ email..."
              value={petitionState.email}
              onChange={(e) => handlePetitionChange('email', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Số điện thoại <span className="text-red-500">*</span>
            </span>
            <input
              required
              placeholder="Nhập số điện thoại..."
              value={petitionState.phone}
              onChange={(e) => handlePetitionChange('phone', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Địa chỉ liên hệ <span className="text-red-500">*</span>
            </span>
            <input
              required
              placeholder="Nhập địa chỉ của bạn..."
              value={petitionState.address}
              onChange={(e) => handlePetitionChange('address', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Tiêu đề kiến nghị <span className="text-red-500">*</span>
          </span>
          <input
            required
            placeholder="Nhập tiêu đề..."
            value={petitionState.title}
            onChange={(e) => handlePetitionChange('title', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </label>

        <RichTextEditor editorRef={editorRef} handleEditorInput={handleEditorInput} />

        <div className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Tệp đính kèm (Tùy chọn)</span>
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-red-400 hover:bg-slate-100"
          >
            <svg
              className="mb-3 h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            {petitionState.attachment ? (
              <span className="text-sm font-medium text-emerald-600">Đã chọn: {petitionState.attachment.name}</span>
            ) : (
              <span className="text-sm text-slate-500">Nhấn vào đây hoặc kéo thả để tải lên tệp đính kèm</span>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => handlePetitionChange('attachment', e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="pt-4 flex gap-3 border-t border-slate-100">
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Gửi kiến nghị
          </button>
          <button
            type="reset"
            className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Nhập lại
          </button>
        </div>
        {petitionMessage && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {petitionMessage}
          </div>
        )}
      </form>
    </section>
  );
};

export default PetitionForm;
