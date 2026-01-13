import { Metadata } from "next";
import Parser from 'rss-parser';
import { NewsArticle } from "@/types/news";
import { NewsPageClient } from "./news-page-client";
import styles from "../custom_css/css.module.css";

export const metadata: Metadata = {
  title: "Tin tức VNExpress | Resident Management",
  description:
    "Cập nhật nhanh các bản tin từ VNExpress RSS, phục vụ công tác quản lý cư dân và chính sách.",
};

export default async function NewsPage() {
  const parser = new Parser();
  let articles: NewsArticle[] = [];

  try {
    const feed = await parser.parseURL('https://vnexpress.net/rss/tin-moi-nhat.rss');
    articles = feed.items.map((item, index) => ({
      id: item.guid || item.link || `vnexpress-${index}`,
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: 'Apollo',
      category: 'tin-tuc-su-kien',
      image: item.enclosure?.url,
    }));
  } catch (error) {
    console.error('Failed to fetch RSS:', error);
    articles = [];
  }

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className={`pointer-events-none absolute inset-0 opacity-60 ${styles["hero-grid"]}`} aria-hidden />
      <div className="pointer-events-none absolute -top-32 left-8 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
      <div className="relative z-10">
        <NewsPageClient initialArticles={articles} />
      </div>
    </div>
  );
}
