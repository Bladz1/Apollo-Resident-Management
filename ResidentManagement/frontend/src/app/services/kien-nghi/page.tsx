"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

import {
  PETITION_CAPTCHA,
  initialPetitionState,
  services,
  type PetitionFormState,
} from "../data";

const petitionService = services.find((service) => service.id === "kien-nghi");

const createEmptyPetitionState = (): PetitionFormState => ({ ...initialPetitionState });

type PetitionStatus = "idle" | "success" | "error";

export default function PetitionPage() {
  const [petitionState, setPetitionState] = useState<PetitionFormState>(() => createEmptyPetitionState());
  const [petitionStatus, setPetitionStatus] = useState<PetitionStatus>("idle");
  const [petitionMessage, setPetitionMessage] = useState<string>(
    "Điền form trực tiếp trên trang và nhấn \"Gửi\" để hoàn tất kiến nghị.",
  );
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handlePetitionChange = <Field extends keyof PetitionFormState>(field: Field, value: PetitionFormState[Field]) => {
    setPetitionState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorCommand = (command: "bold" | "italic" | "insertUnorderedList") => {
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

  const handlePetitionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (petitionState.captcha.trim().toUpperCase() !== PETITION_CAPTCHA) {
      setPetitionStatus("error");
      setPetitionMessage("Mã xác nhận chưa chính xác. Vui lòng kiểm tra và nhập lại.");
      return;
    }

    setPetitionStatus("success");
    setPetitionMessage(
      "Kiến nghị đã được ghi nhận. Hệ thống sẽ gửi email xác nhận nếu bạn cung cấp địa chỉ email hợp lệ.",
    );
  };

  const handlePetitionReset = () => {
    setPetitionState(createEmptyPetitionState());
    setPetitionStatus("idle");
    setPetitionMessage("Điền form trực tiếp trên trang và nhấn \"Gửi\" để hoàn tất kiến nghị.");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-gradient-to-r from-red-900/85 via-slate-950 to-amber-900/40 text-slate-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Gửi kiến nghị trực tuyến</p>
            <h1 className="mt-3 text-3xl md:text-4xl">{petitionService?.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">{petitionService?.description}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-amber-300/60 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/10"
          >
            ← Quay lại trang dịch vụ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h2 className="text-xl font-semibold text-amber-200">Quy trình gửi kiến nghị</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-200">
            <li>Điền đầy đủ thông tin người gửi để thuận tiện xác minh và phản hồi.</li>
            <li>Nhập tiêu đề và nội dung kiến nghị bằng trình soạn thảo hỗ trợ định dạng.</li>
            <li>Đính kèm tài liệu, hình ảnh minh chứng (nếu có).</li>
            <li>Xác nhận mã CAPTCHA và nhấn "Gửi" để hoàn tất.</li>
            <li>Hệ thống sẽ gửi email xác nhận khi cung cấp địa chỉ liên hệ hợp lệ.</li>
          </ol>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <form className="space-y-4" onSubmit={handlePetitionSubmit} onReset={handlePetitionReset}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="petition-full-name" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Họ và tên người gửi <span className="text-amber-300">*</span>
                </label>
                <input
                  id="petition-full-name"
                  type="text"
                  required
                  value={petitionState.fullName}
                  onChange={(event) => handlePetitionChange("fullName", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  placeholder="Nguyễn Văn B"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="petition-email" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Email <span className="text-amber-300">*</span>
                </label>
                <input
                  id="petition-email"
                  type="email"
                  required
                  value={petitionState.email}
                  onChange={(event) => handlePetitionChange("email", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  placeholder="nguoidan@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="petition-phone" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Số điện thoại <span className="text-amber-300">*</span>
                </label>
                <input
                  id="petition-phone"
                  type="tel"
                  pattern="(0|\\+84)[0-9]{9,10}"
                  required
                  value={petitionState.phone}
                  onChange={(event) => handlePetitionChange("phone", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  placeholder="0912345678"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="petition-address" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Địa chỉ liên hệ <span className="text-amber-300">*</span>
                </label>
                <input
                  id="petition-address"
                  type="text"
                  required
                  value={petitionState.address}
                  onChange={(event) => handlePetitionChange("address", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="petition-title" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Tiêu đề kiến nghị <span className="text-amber-300">*</span>
              </label>
              <input
                id="petition-title"
                type="text"
                required
                value={petitionState.title}
                onChange={(event) => handlePetitionChange("title", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                placeholder="Nội dung chính của kiến nghị"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Nội dung kiến nghị <span className="text-amber-300">*</span>
                </span>
                <span className="rounded-full bg-amber-200/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                  RadEditor
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleEditorCommand("bold")}
                  className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-200 shadow-sm hover:border-amber-300 hover:text-amber-200"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleEditorCommand("italic")}
                  className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold italic text-slate-200 shadow-sm hover:border-amber-300 hover:text-amber-200"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleEditorCommand("insertUnorderedList")}
                  className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-200 shadow-sm hover:border-amber-300 hover:text-amber-200"
                >
                  Danh sách
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="min-h-[200px] rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none"
                aria-label="Trình chỉnh sửa nội dung kiến nghị"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="petition-attachment" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Tệp đính kèm (hình ảnh, tài liệu)
              </label>
              <input
                id="petition-attachment"
                type="file"
                onChange={(event) => handlePetitionChange("attachment", event.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-xl border border-dashed border-amber-300/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              />
              {petitionState.attachment && (
                <p className="text-xs text-slate-300">Đã chọn: {petitionState.attachment.name}</p>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-[auto,1fr] md:items-center">
              <div className="flex h-14 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 px-6 text-lg font-semibold tracking-[0.3em] text-amber-200 shadow-inner shadow-black/40">
                {PETITION_CAPTCHA}
              </div>
              <input
                type="text"
                required
                value={petitionState.captcha}
                onChange={(event) => handlePetitionChange("captcha", event.target.value.toUpperCase())}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm uppercase tracking-[0.3em] text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                placeholder="Nhập mã xác nhận"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:-translate-y-0.5"
              >
                Gửi
              </button>
              <button
                type="reset"
                className="inline-flex items-center justify-center rounded-full border border-amber-300/60 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-200/10"
              >
                Nhập lại
              </button>
            </div>

            <div
              className={`rounded-2xl border p-4 text-xs font-semibold ${
                petitionStatus === "success"
                  ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-200"
                  : petitionStatus === "error"
                  ? "border-rose-400/60 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-slate-900/60 text-slate-200"
              }`}
            >
              {petitionMessage}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
