export function ProgressBar({step}: { step: number }) {
  const STEP_LABELS = ['Vehicle', 'Owner', 'Items', 'Reason', 'Plate Info', 'Certification', 'Review', 'Complete'];
  return (
    <div style={{background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 0', marginBottom: 32}}>
      <div className="container" style={{maxWidth: 860}}>
        <div className="d-flex align-items-center justify-content-between position-relative">
          <div style={{position: 'absolute', top: 16, left: 0, right: 0, height: 2, background: '#E5E7EB', zIndex: 0, marginLeft: 45, marginRight: 45}}/>
          {STEP_LABELS.map((label, i) => {
            const si = i + 1;
            const done = step > si;
            const active = step === si;
            return (
              <div key={i} className="d-flex flex-column align-items-center" style={{zIndex: 1, flex: 1}}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? '#047857' : active ? '#003087' : '#F3F4F6',
                    border: `2px solid ${done ? '#047857' : active ? '#003087' : '#D1D5DB'}`,
                    color: (done || active) ? '#fff' : '#9CA3AF',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {done ? '✓' : si}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    marginTop: 5,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#003087' : done ? '#047857' : '#9CA3AF',
                    whiteSpace: 'nowrap',
                    letterSpacing: '.04em'
                  }}
                >{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}