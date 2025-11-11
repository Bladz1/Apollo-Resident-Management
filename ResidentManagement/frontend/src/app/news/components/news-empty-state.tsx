interface NewsEmptyStateProps {
  message?: string;
}

export function NewsEmptyState({ message }: NewsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <span className="text-4xl">🗞️</span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hiện chưa có bản tin phù hợp</h3>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
        {message ?? "Hãy thử chọn chuyên mục khác hoặc cập nhật lại nguồn tin."}
      </p>
    </div>
  );
}
