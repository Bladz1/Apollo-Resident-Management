/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { NewsArticle } from "@/types/news";
import { formatPublishedDate } from "../utils";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={article.image ?? "/images/trongdong.jpg"}
          alt={article.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
          {article.source}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary dark:bg-primary/20">
            {formatPublishedDate(article.pubDate)}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-primary dark:text-slate-100">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
          {article.description}
        </p>
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
          <span>Đọc thêm</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
