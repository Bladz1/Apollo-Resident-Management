interface NewsEmptyStateProps {
  message?: string;
}

export function NewsEmptyState({ message }: NewsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-slate-200">
      <span className="text-4xl">🗞️</span>
      <h3 className="text-lg font-semibold text-white">Hiện chưa có bản tin phù hợp</h3>
      <p className="max-w-md text-sm text-slate-300">
        {message ?? "Hãy thử chọn chuyên mục khác hoặc cập nhật lại nguồn tin."}
      </p>
    </div>
  );
}
