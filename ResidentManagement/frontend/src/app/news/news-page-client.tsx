"use client";

import { useMemo, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { CATEGORY_LABELS, CategoryKey } from "./sample-data";
import { NewsHero } from "./components/news-hero";
import { NewsCategoryTabs } from "./components/news-category-tabs";
import { NewsGrid } from "./components/news-grid";
import { NewsEmptyState } from "./components/news-empty-state";
import { NewsSkeleton } from "./components/news-skeleton";

interface NewsPageClientProps {
  initialArticles: NewsArticle[];
}

type CategoryArticlesMap = Record<CategoryKey, NewsArticle[]>;

export function NewsPageClient({ initialArticles }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const categoryOptions = useMemo(() => {
    const keys = Object.keys(CATEGORY_LABELS) as CategoryKey[];
    return keys.map((key) => {
      const label = CATEGORY_LABELS[key];
      const count = initialByCategory[key]?.length ?? 0;
      return { value: key, label, count };
    });
  }, [initialByCategory]);

  const selectedArticles = useMemo(() => {
    return initialByCategory[selectedCategory] ?? [];
  }, [initialByCategory, selectedCategory]);

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
    window.location.reload();
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <header className="flex flex-col gap-5 rounded-3xl ">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            
            <h1 className="text-3xl font-heading font-semibold text-white md:text-4xl lg:text-5xl">
              Tin tức & cập nhật thời gian thực
            </h1>
          </div>
          
        </div>
        <p className="max-w-3xl text-sm text-slate-200 md:text-base">
          Báo dành riêng cho người Việt, giao diện này giúp bạn theo dõi nhanh các tin tức mới nhất từ Việt Nam.
        </p>
      </header>

      

      <div className="mt-12 space-y-10">
        {heroArticle && (
          <div className="space-y-8">
            <NewsHero article={heroArticle} />
            {secondaryArticles.length > 0 && <NewsGrid articles={secondaryArticles} />}
          </div>
        )}

        {!heroArticle && <NewsEmptyState />}
      </div>
    </div>
  );
}
