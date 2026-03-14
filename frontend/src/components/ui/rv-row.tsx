export function RvRow({ label, value, errorKey, be }: { label: string; value?: string; errorKey?: string; be: Record<string, string> }) {
  const hasVal = !!value?.trim();
  const beErr = errorKey ? be[errorKey] : undefined;
  return (
    <div className="rv-row">
      <span className={`rv-lbl ${hasVal ? 'has-val' : 'no-val'}`}>{label}</span>
      {beErr
        ? <span className="rv-val err-val">⚠ {beErr}</span>
        : <span className={`rv-val ${hasVal ? 'filled' : 'empty'}`}>{value || '—'}</span>}
    </div>
  );
}