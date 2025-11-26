"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsArticle, NewsApiResponse } from "@/types/news";
import { CATEGORY_LABELS, CategoryKey } from "./sample-data";
import { NewsHero } from "./components/news-hero";
import { NewsCategoryTabs } from "./components/news-category-tabs";
import { NewsGrid } from "./components/news-grid";
import { NewsEmptyState } from "./components/news-empty-state";
import { NewsSkeleton } from "./components/news-skeleton";

const NEWS_API_BASE = process.env.NEXT_PUBLIC_NEWS_API_URL ?? "";

interface NewsPageClientProps {
  initialArticles: NewsArticle[];
}

type CategoryArticlesMap = Record<CategoryKey, NewsArticle[]>;

export function NewsPageClient({ initialArticles }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteArticles, setRemoteArticles] = useState<Partial<Record<CategoryKey, NewsArticle[]>>>({});
  const [refreshIndex, setRefreshIndex] = useState(0);

  const initialByCategory = useMemo(() => {
    const keys = Object.keys(CATEGORY_LABELS) as CategoryKey[];
    const map = Object.fromEntries(keys.map((key) => [key, [] as NewsArticle[]])) as CategoryArticlesMap;

    initialArticles.forEach((article) => {
      const category = keys.includes(article.category as CategoryKey)
        ? (article.category as CategoryKey)
        : ("tin-tuc-su-kien" as CategoryKey);

      if (category !== "all") {
        map[category].push(article);
      }
      map.all.push(article);
    });

    return map;
  }, [initialArticles]);

  useEffect(() => {
    if (!NEWS_API_BASE || selectedCategory === "all") {
      return undefined;
    }

    const controller = new AbortController();

    const fetchCategoryArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let requestUrl: string;
        try {
          const url = new URL(NEWS_API_BASE);
          url.searchParams.set("category", selectedCategory);
          requestUrl = url.toString();
        } catch (urlError) {
          const separator = NEWS_API_BASE.includes("?") ? "&" : "?";
          requestUrl = `${NEWS_API_BASE}${separator}category=${selectedCategory}`;
        }

        const response = await fetch(requestUrl, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Không thể tải dữ liệu (${response.status})`);
        }

        const data = (await response.json()) as NewsApiResponse | NewsArticle[];
        const items = Array.isArray(data) ? data : data.items;

        if (Array.isArray(items)) {
          setRemoteArticles((prev) => ({
            ...prev,
            [selectedCategory]: items,
          }));
        }
      } catch (requestError) {
        if ((requestError as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to fetch news", requestError);
        setError("Không thể đồng bộ tin tức từ nguồn bên ngoài. Đang hiển thị dữ liệu gần nhất.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCategoryArticles();

    return () => controller.abort();
  }, [selectedCategory, refreshIndex]);

  const categoryOptions = useMemo(() => {
    const keys = Object.keys(CATEGORY_LABELS) as CategoryKey[];
    return keys.map((key) => {
      const label = CATEGORY_LABELS[key];
      if (key === "all") {
        const remoteCount = Object.values(remoteArticles).reduce((acc, articles) => acc + (articles?.length ?? 0), 0);
        const count = remoteCount > 0 ? remoteCount : initialByCategory.all.length;
        return { value: key, label, count };
      }

      const count = remoteArticles[key]?.length ?? initialByCategory[key]?.length ?? 0;
      return { value: key, label, count };
    });
  }, [initialByCategory, remoteArticles]);

  const selectedArticles = useMemo(() => {
    if (selectedCategory === "all") {
      const aggregated = new Map<string, NewsArticle>();
      (Object.entries(remoteArticles) as [CategoryKey, NewsArticle[]][]).forEach(([, articles]) => {
        articles?.forEach((article) => {
          aggregated.set(article.id ?? article.link, article);
        });
      });

      if (aggregated.size > 0) {
        return Array.from(aggregated.values());
      }

      return initialByCategory.all;
    }

    const remote = remoteArticles[selectedCategory];
    if (remote && remote.length > 0) {
      return remote;
    }

    return initialByCategory[selectedCategory] ?? [];
  }, [initialByCategory, remoteArticles, selectedCategory]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return selectedArticles;
    }

    return selectedArticles.filter((article) => {
      const haystack = `${article.title} ${article.description} ${article.source}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, selectedArticles]);

  const heroArticle = filteredArticles[0];
  const secondaryArticles = filteredArticles.slice(1);

  const handleRefresh = () => {
    if (!NEWS_API_BASE || selectedCategory === "all") {
      setRemoteArticles({});
      setError(null);
      return;
    }
    setRefreshIndex((index) => index + 1);
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <header className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl shadow-black/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/90">
              Bản tin Chính phủ
            </span>
            <h1 className="text-3xl font-heading font-semibold text-white md:text-4xl lg:text-5xl">
              Tin tức & cập nhật thời gian thực
            </h1>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-400/60 hover:bg-rose-500/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:flex"
          >
            <span>Đồng bộ</span>
            <span aria-hidden>↻</span>
          </button>
        </div>
        <p className="max-w-3xl text-sm text-slate-200 md:text-base">
          Khai thác dữ liệu từ Cổng thông tin Chính phủ và Google News RSS, giao diện này giúp bạn theo dõi nhanh các nghị quyết
          mới, chính sách nổi bật và hoạt động đối ngoại liên quan đến quản lý cư dân.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-lg shadow-black/10 md:flex-row md:items-center md:justify-between">
        <NewsCategoryTabs options={categoryOptions} value={selectedCategory} onValueChange={setSelectedCategory} />
        <div className="flex w-full items-center gap-3 md:w-80">
          <div className="relative w-full">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc nguồn tin..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-rose-400/60 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-200"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-400/60 hover:bg-rose-500/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            ↻
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100 shadow-lg shadow-black/10">
          {error}
        </div>
      )}

      <div className="mt-12 space-y-10">
        {isLoading && <NewsSkeleton />}

        {!isLoading && heroArticle && (
          <div className="space-y-8">
            <NewsHero article={heroArticle} />
            {secondaryArticles.length > 0 && <NewsGrid articles={secondaryArticles} />}
          </div>
        )}

        {!isLoading && !heroArticle && <NewsEmptyState />}
      </div>
    </div>
  );
}
