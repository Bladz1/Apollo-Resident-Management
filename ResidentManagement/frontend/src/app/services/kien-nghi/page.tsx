"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { loadUserId, TOKEN_KEY } from "@/utils/auth-storage";
import { uploadFeedbackFile } from "@/utils/supabase";
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

      let attachmentUrl: string | null = null;
      if (petitionState.attachment) {
        attachmentUrl = await uploadFeedbackFile(
          petitionState.attachment
        );
      }

      const formData = new FormData();
      formData.append("name", petitionState.fullName);
      formData.append("email", petitionState.email);
      formData.append("phone", petitionState.phone);
      formData.append("address", petitionState.address);
      formData.append("title", petitionState.title);
      formData.append("description", petitionState.content);

      if (attachmentUrl) {
        formData.append("attachmentUrl", attachmentUrl);
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
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <form
            className="space-y-4"
            onSubmit={handlePetitionSubmit}
            onReset={handlePetitionReset}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="Họ và tên"
                value={petitionState.fullName}
                onChange={(e) =>
                  handlePetitionChange("fullName", e.target.value)
                }
                className="input"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={petitionState.email}
                onChange={(e) =>
                  handlePetitionChange("email", e.target.value)
                }
                className="input"
              />
              <input
                required
                placeholder="Số điện thoại"
                value={petitionState.phone}
                onChange={(e) =>
                  handlePetitionChange("phone", e.target.value)
                }
                className="input"
              />
              <input
                required
                placeholder="Địa chỉ"
                value={petitionState.address}
                onChange={(e) =>
                  handlePetitionChange("address", e.target.value)
                }
                className="input"
              />
            </div>

            <input
              required
              placeholder="Tiêu đề kiến nghị"
              value={petitionState.title}
              onChange={(e) =>
                handlePetitionChange("title", e.target.value)
              }
              className="input"
            />

            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="min-h-[200px] rounded-xl border border-slate-200 p-4 text-sm"
            />

            <input
              type="file"
              onChange={(e) =>
                handlePetitionChange(
                  "attachment",
                  e.target.files?.[0] ?? null
                )
              }
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white"
              >
                Gửi
              </button>
              <button
                type="reset"
                className="rounded-full border px-6 py-3 text-sm"
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
