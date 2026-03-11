'use client';

import React from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const faqs = [
    {
      question: "Làm thế nào để đăng ký tài khoản cư trú?",
      answer: "Bạn có thể đăng ký tài khoản bằng cách nhấn vào nút 'Đăng ký' trên trang chủ hoặc trang đăng nhập. Bạn cần cung cấp số CCCD, họ tên, địa chỉ và các thông tin cá nhân khác để xác minh."
    },
    {
      question: "Tôi có thể thực hiện những dịch vụ nào trực tuyến?",
      answer: "Hiện tại hệ thống hỗ trợ khai báo tạm trú, tạm vắng, nộp các loại phí hành chính, gửi kiến nghị và theo dõi tin tức dân cư."
    },
    {
      question: "Làm sao để thanh toán các khoản phí?",
      answer: "Vào mục 'Dịch vụ' -> 'Thanh Toán'. Tại đây bạn có thể chọn loại phí cần nộp và thực hiện thanh toán qua các cổng thanh toán tích hợp."
    },
    {
      question: "Thời gian xử lý kiến nghị là bao lâu?",
      answer: "Thông thường, các kiến nghị sẽ được tiếp nhận và xử lý trong vòng 3-5 ngày làm việc tùy thuộc vào tính chất của vấn đề."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-700 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Trung tâm Hỗ trợ Người dân</h1>
          <p className="mt-6 text-lg text-red-100">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn giải quyết các vấn đề liên quan đến thủ tục cư trú và dịch vụ công.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {/* FAQ Section */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">?</span>
                Câu hỏi thường gặp (FAQ)
              </h2>
              <div className="mt-8 space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-red-900 p-8 text-white shadow-xl shadow-red-900/20">
              <h2 className="text-2xl font-bold">Vẫn cần hỗ trợ thêm?</h2>
              <p className="mt-4 text-red-100">
                Nếu bạn không tìm thấy câu trả lời cho vấn đề của mình, hãy gửi kiến nghị trực tiếp cho chúng tôi.
              </p>
              <Link
                href="/services/kien-nghi"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-red-900 transition-transform hover:scale-105"
              >
                Gửi kiến nghị ngay
              </Link>
            </section>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Thông tin liên hệ</h3>
                <div className="mt-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hotline 24/7</p>
                      <p className="text-xl font-bold text-slate-900">1800 1096</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Hỗ trợ</p>
                      <p className="text-sm font-bold text-slate-900 break-all">hotro@quanlycuutru.gov.vn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Địa chỉ Trụ sở</p>
                      <p className="text-sm font-bold text-slate-900 italic">47 Phạm Văn Đồng, Cầu Giấy, Hà Nội</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 p-6 text-white text-center">
                <p className="text-sm">Bạn là cán bộ quản lý?</p>
                <Link href="/admin" className="mt-2 block text-sm font-bold text-red-400 hover:text-red-300">
                  Đăng nhập trang quản trị →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
