export function CheckField({ label, id, checked, onChange, disabled }:
                    { label: string; id: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="form-check my-2" style={{ paddingLeft: 28 }}>
      <input className="form-check-input" type="checkbox" id={id} checked={checked}
             onChange={e => onChange?.(e.target.checked)} disabled={disabled}
             style={{ width: 18, height: 18, marginTop: 2, cursor: disabled ? 'not-allowed' : 'pointer' }} />
      <label className="form-check-label ms-2" htmlFor={id} style={{ fontSize: 14, color: disabled ? '#B0B7C3' : '#1F2937', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {label}
      </label>
    </div>
  );
}