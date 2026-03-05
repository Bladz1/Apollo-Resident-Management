"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { loadUserId, TOKEN_KEY } from "@/utils/auth-storage";
import { initialPetitionState, services, type PetitionFormState } from "../data";

const petitionService = services.find((service) => service.id === "kien-nghi");
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:8080/resident-management";

const createEmptyPetitionState = (): PetitionFormState => ({
  ...initialPetitionState,
});

export default function PetitionPage() {
  const [petitionState, setPetitionState] = useState<PetitionFormState>(() =>
    createEmptyPetitionState()
  );
  const [petitionMessage, setPetitionMessage] = useState<string>("");

  const editorRef = useRef<HTMLDivElement | null>(null);

  const handlePetitionChange = <
    Field extends keyof PetitionFormState
  >(
    field: Field,
    value: PetitionFormState[Field]
  ) => {
    setPetitionState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorCommand = (
    command: "bold" | "italic" | "insertUnorderedList"
  ) => {
    if (typeof document === "undefined") return;
    document.execCommand(command);
    if (editorRef.current) {
      handlePetitionChange("content", editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    handlePetitionChange("content", editorRef.current.innerHTML);
  };

  const handlePetitionSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const userId = loadUserId();
      if (!userId) return;

      const formData = new FormData();
      formData.append("name", petitionState.fullName);
      formData.append("email", petitionState.email);
      formData.append("phone", petitionState.phone);
      formData.append("address", petitionState.address);
      formData.append("title", petitionState.title);
      formData.append("description", petitionState.content);

      if (petitionState.attachment) {
        formData.append("file", petitionState.attachment);
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(TOKEN_KEY)
          : null;

      const response = await fetch(
        `${API_BASE_URL}/feedbacks/${userId}`,
        {
          method: "POST",
          body: formData,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setPetitionMessage("Gửi thành công! Phản ánh của bạn đã được ghi nhận.");
      handlePetitionReset();
    } catch (error) {
      console.error("Submit petition error:", error);
    }
  };

  const handlePetitionReset = () => {
    setPetitionState(createEmptyPetitionState());
    setPetitionMessage("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-100">
              Gửi kiến nghị trực tuyến
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {petitionService?.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-red-50 md:text-base">
              {petitionService?.description}
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

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
          <form
            className="space-y-6"
            onSubmit={handlePetitionSubmit}
            onReset={handlePetitionReset}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-500">*</span></span>
                <input
                  required
                  placeholder="Nhập họ và tên..."
                  value={petitionState.fullName}
                  onChange={(e) =>
                    handlePetitionChange("fullName", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ Email <span className="text-red-500">*</span></span>
                <input
                  required
                  type="email"
                  placeholder="Nhập địa chỉ email..."
                  value={petitionState.email}
                  onChange={(e) =>
                    handlePetitionChange("email", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại <span className="text-red-500">*</span></span>
                <input
                  required
                  placeholder="Nhập số điện thoại..."
                  value={petitionState.phone}
                  onChange={(e) =>
                    handlePetitionChange("phone", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ liên hệ <span className="text-red-500">*</span></span>
                <input
                  required
                  placeholder="Nhập địa chỉ của bạn..."
                  value={petitionState.address}
                  onChange={(e) =>
                    handlePetitionChange("address", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Tiêu đề kiến nghị <span className="text-red-500">*</span></span>
              <input
                required
                placeholder="Nhập tiêu đề..."
                value={petitionState.title}
                onChange={(e) =>
                  handlePetitionChange("title", e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Nội dung chi tiết <span className="text-red-500">*</span></span>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="min-h-[200px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

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
                  <span className="text-sm font-medium text-emerald-600">
                    Đã chọn: {petitionState.attachment.name}
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">
                    Nhấn vào đây hoặc kéo thả để tải lên tệp đính kèm
                  </span>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handlePetitionChange(
                      "attachment",
                      e.target.files?.[0] ?? null
                    )
                  }
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
      </main>
    </div>
  );
}
