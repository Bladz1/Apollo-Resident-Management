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
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-inner shadow-black/5">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? "bg-rose-500/80 text-white shadow-lg shadow-rose-900/30"
                : "bg-transparent text-slate-200 hover:bg-white/10"
            }`}
          >
            <span>{option.label}</span>
            {typeof option.count === "number" && (
              <span
                className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "border border-white/10 bg-white/10 text-slate-200"
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
