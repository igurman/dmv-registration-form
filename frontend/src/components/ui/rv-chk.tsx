export function RvChk({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="rv-chk">
      <div className={`rv-chk-box${checked ? ' on' : ''}`}>{checked ? '✓' : ''}</div>
      <span className={`rv-chk-lbl ${checked ? 'on' : 'off'}`}>{label}</span>
    </div>
  );
}