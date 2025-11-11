"use client";

import { CategoryKey } from "../sample-data";

interface CategoryOption {
  value: CategoryKey;
  label: string;
  count?: number;
}

interface NewsCategoryTabsProps {
  options: CategoryOption[];
  value: CategoryOption["value"];
  onValueChange: (value: CategoryOption["value"]) => void;
}

export function NewsCategoryTabs({ options, value, onValueChange }: NewsCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/60 bg-white/70 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${
              isActive
                ? "bg-primary text-white shadow-lg"
                : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <span>{option.label}</span>
            {typeof option.count === "number" && (
              <span
                className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
