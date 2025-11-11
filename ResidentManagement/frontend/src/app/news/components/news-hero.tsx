/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { NewsArticle } from "@/types/news";
import { formatPublishedDate } from "../utils";

interface NewsHeroProps {
  article: NewsArticle;
}

export function NewsHero({ article }: NewsHeroProps) {
  return (
    <Link
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-[420px] overflow-hidden rounded-3xl border border-slate-200/40 bg-slate-900/80 text-white shadow-xl transition hover:shadow-2xl dark:border-slate-700/60"
    >
      <img
        src={article.image ?? "/images/trongdong.jpg"}
        alt={article.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/10" />
      <div className="absolute inset-x-0 bottom-0 space-y-4 p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-200/80">
          <span className="rounded-full bg-primary/80 px-3 py-1 text-[11px] font-semibold shadow-lg">Tin nổi bật</span>
          <span className="rounded-full bg-slate-900/70 px-3 py-1 font-medium backdrop-blur">
            {formatPublishedDate(article.pubDate)}
          </span>
          <span className="rounded-full bg-slate-900/70 px-3 py-1 font-medium backdrop-blur">
            {article.source}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-semibold leading-snug text-white drop-shadow-lg md:text-4xl">
          {article.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-200/90 md:text-base">
          {article.description}
        </p>
      </div>
    </Link>
  );
}
