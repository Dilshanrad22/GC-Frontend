export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-200 rounded-lg mt-2" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="h-10 bg-slate-100 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
