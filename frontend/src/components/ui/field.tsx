export function Field(
  {label, id, value, onChange, error, type = 'text', maxLength, placeholder, required, disabled}:
  {
    label: string;
    id: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    type?: string;
    maxLength?: number;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean
  }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold" style={{fontSize: 13, color: disabled ? '#B0B7C3' : '#374151', letterSpacing: '.02em'}}>
        {label}{required && <span style={{color: '#DC2626', marginLeft: 3}}>*</span>}
      </label>
      <input
        id={id} type={type} className={`form-control${error ? ' is-invalid' : ''}`}
        value={value} onChange={e => onChange(e.target.value)}
        maxLength={maxLength} placeholder={placeholder} disabled={disabled}
        style={{
          borderRadius: 6,
          fontSize: 14,
          padding: '8px 12px',
          background: disabled ? '#F9FAFB' : '#fff',
          color: disabled ? '#B0B7C3' : '#111827',
          borderColor: error ? '#DC2626' : '#D1D5DB'
        }}
      />
      {error && <div className="invalid-feedback d-block" style={{fontSize: 12}}>{error}</div>}
    </div>
  );
}