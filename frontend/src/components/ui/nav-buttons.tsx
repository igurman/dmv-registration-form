export function NavButtons({ onBack, onNext, nextLabel = 'Next', loading }: { onBack?: () => void; onNext: () => void; nextLabel?: string; loading?: boolean }) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
      {onBack
        ? <button className="btn" onClick={onBack} style={{ border: '1.5px solid #D1D5DB', color: '#374151', borderRadius: 8, padding: '9px 24px', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}>← Back</button>
        : <div />}
      <button className="btn" onClick={onNext} disabled={loading}
              style={{ background: '#003087', color: '#fff', borderRadius: 8, padding: '9px 28px', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
        {loading ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</> : <>{nextLabel} →</>}
      </button>
    </div>
  );
}