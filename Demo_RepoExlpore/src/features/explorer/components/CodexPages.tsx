

export function PageHeader({ title, num }: { title: string; num: string }) {
  return (
    <div className="flex justify-between items-center mb-6 pb-3.5 border-b border-[rgba(255,255,255,0.08)]">
      <span className="font-jetbrains text-[10px] tracking-[0.3em] text-accent">{title}</span>
      <span className="font-jetbrains text-[10px] text-text-muted">{num}</span>
    </div>
  );
}
