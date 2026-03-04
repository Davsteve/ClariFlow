export default function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-slate-200">
        {title}
      </h2>
      {action}
    </div>
  );
}