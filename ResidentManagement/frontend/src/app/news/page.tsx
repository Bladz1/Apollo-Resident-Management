import { Metadata } from "next";
import { sampleNewsArticles } from "./sample-data";
import { NewsPageClient } from "./news-page-client";
import styles from "../custom_css/css.module.css";

export const metadata: Metadata = {
  title: "Tin tức Chính phủ | Resident Management",
  description:
    "Cập nhật nhanh các bản tin từ Cổng thông tin Chính phủ và Google News RSS, phục vụ công tác quản lý cư dân và chính sách.",
};

export default function NewsPage() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className={`pointer-events-none absolute inset-0 opacity-60 ${styles["hero-grid"]}`} aria-hidden />
      <div className="pointer-events-none absolute -top-32 left-8 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
      <div className="relative z-10">
        <NewsPageClient initialArticles={sampleNewsArticles} />
      </div>
    </div>
  );
}
