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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10 backdrop-blur transition hover:-translate-y-1 hover:border-rose-400/60 hover:bg-white/10 hover:shadow-rose-500/20"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={article.image ?? "/images/trongdong.jpg"}
          alt={article.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200 backdrop-blur">
          {article.source}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-amber-200">
            {formatPublishedDate(article.pubDate)}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-white transition group-hover:text-rose-200">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-sm text-slate-300">
          {article.description}
        </p>
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-rose-200 transition group-hover:gap-3">
          <span>Đọc thêm</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
