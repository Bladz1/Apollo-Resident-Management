import { Metadata } from "next";
import { sampleNewsArticles } from "./sample-data";
import { NewsPageClient } from "./news-page-client";

export const metadata: Metadata = {
  title: "Tin tức Chính phủ | Resident Management",
  description:
    "Cập nhật nhanh các bản tin từ Cổng thông tin Chính phủ và Google News RSS, phục vụ công tác quản lý cư dân và chính sách.",
};

export default function NewsPage() {
  return <NewsPageClient initialArticles={sampleNewsArticles} />;
}
