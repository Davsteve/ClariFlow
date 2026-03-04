export default function Metric({ label, value, accent = "default" }) {
  const color =
    accent === "positive"
      ? "text-emerald-400"
      : accent === "negative"
      ? "text-red-400"
      : "text-slate-100";

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-3xl font-semibold tracking-tight ${color}`}>
        {value}
      </p>
    </div>
  );
}