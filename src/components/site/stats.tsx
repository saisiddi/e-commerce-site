const stats = [
  { label: "AI fittings generated", value: "42k+" },
  { label: "Luxury styles curated", value: "1.2k" },
  { label: "Avg. try-on time", value: "38s" },
  { label: "Client satisfaction", value: "98%" },
];

export function Stats() {
  return (
    <div className="grid gap-6 rounded-[48px] border border-stone bg-white/70 p-8 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-3xl font-semibold">{stat.value}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ink/60">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
