export function SectionCard({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#003087', padding: '14px 24px' }}>
        <h6 className="mb-0 text-white fw-bold" style={{ fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>{title}</h6>
      </div>
      {note && (
        <div style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A', padding: '10px 24px' }}>
          <p className="mb-0" style={{ fontSize: 12, color: '#92400E' }}><strong>NOTE:</strong> {note}</p>
        </div>
      )}
      <div className="card-body" style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}