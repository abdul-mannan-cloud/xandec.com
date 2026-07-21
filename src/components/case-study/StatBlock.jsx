export default function StatBlock({ value, label, note }) {
  return (
    <article className="rounded-2xl border border-secondary/10 bg-secondary/5 p-4 sm:p-5">
      <div className="text-2xl font-semibold tracking-tight text-secondary sm:text-3xl">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-secondary/60">
        {label}
      </div>
      {note ? <p className="mt-3 text-sm leading-relaxed text-secondary/75">{note}</p> : null}
    </article>
  );
}
