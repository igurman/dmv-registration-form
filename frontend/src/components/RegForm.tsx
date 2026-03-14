import { useState } from 'react';
import {validateStep} from "./Validation";
import {formatPhone} from "../helpers/formats";
import {ProgressBar} from "./ui/progress-bar";
import {RvRow} from "./ui/rv-row";
import {RvChk} from "./ui/rv-chk";
import {SectionCard} from "./ui/section-card";
import {Field} from "./ui/field";
import {NavButtons} from "./ui/nav-buttons";
import {CheckField} from "./ui/check-field";
import {buildPayload} from "../helpers/buildPayload";
import {dict} from "../helpers/dictionary";

const BACK_URL = 'http://localhost:5000/api/v1/form';
const FILE_NAME = 'REG-156-filled.pdf';

const initVehicle: VehicleForm = {
  licensePlate: '',
  make: '',
  vin: '',
  dpPlacardNumber: '',
  birthDate: '',
  engineNumber: ''
};
const initOwner: OwnerForm = {
  fullName: '',
  dlNumber: '',
  coOwnerName: '',
  dl2Number: '',
  physicalAddress: '',
  apt: '',
  city: '',
  state: '',
  zipCode: '',
  county: '',
  mailingAddress: '',
  mailingApt: '',
  mailingCity: '',
  mailingState: '',
  mailingZipCode: ''
};
const initItems: ItemsForm = {
  licensePlates: false,
  registrationCard: false,
  licenseYearSticker: false,
  licenseMonthSticker: false,
  vesselYearSticker: false,
  vesselCertificate: false,
  vesselMusselFee: false,
  dpPlacard: false,
  dpIdCard: false,
  pnoCard: false,
  pfrSticker: false,
  cvraWeightDecal: false,
  cvraYearSticker: false,
  trailerOhvIdCard: false
};
const initReason: ReasonForm = {
  lost: false,
  stolen: false,
  destroyed: false,
  notReceivedFromDmv: false,
  notReceivedFromPriorOwner: false,
  surrendered: false,
  surrenderedOne: false,
  surrenderedTwo: false,
  specialPlatesRetained: false,
  regCardCurrentAddress: false,
  cvcSection: false,
  other: false,
  oneLicensePlate: false,
  twoLicensePlates: false,
  explanation: ''
};
const initCert: CertForm = {
  printName: '',
  title: '',
  phone: '',
  date: '',
  email: ''
};
const initForm: FormState = {vehicle: initVehicle, owner: initOwner, itemsRequested: initItems, reason: initReason, certification: initCert};

export default function RegForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const [sameAsPhysical, setSameAsPhysical] = useState(true);
  const [loading, setLoading] = useState(false);

  /* Helpers */
  const setV = <K extends keyof FormState>(section: K) => (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [section]: { ...(prev[section] as object), [field]: value } }));

  const clearErr = (...keys: string[]) => {
    setFieldErrors(prev => { const e = { ...prev }; keys.forEach(k => delete e[k]); return e; });
    setBackendErrors(prev => { const e = { ...prev }; keys.forEach(k => delete e[k]); return e; });
  };

  // combined error lookup: frontend first, then backend
  const fe = (key: string) => fieldErrors[key] || backendErrors[key];

  const sv = setV('vehicle'),
    so = setV('owner'),
    si = setV('itemsRequested'),
    sr = setV('reason'),
    sc = setV('certification');

  const goNext = (nextStep: number) => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(prev => ({ ...prev, ...errs }));
      return; // block navigation
    }
    setFieldErrors({}); // clear all frontend errors on successful step
    setStep(nextStep);
  };

  const goBack = (prevStep: number) => {
    setStep(prevStep);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = buildPayload(form, sameAsPhysical);
      const res = await fetch(BACK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = FILE_NAME; a.click();
        URL.revokeObjectURL(url);
        setForm(initForm); setFieldErrors({}); setBackendErrors({});
        setStep(8);
      } else {
        const data = await res.json();

        if (data.message.county < 1) return;

        const map: Record<string, string> = {};
        data.message.forEach((msg: string) => {
          const match = msg.match(/^([a-zA-Z]+\.[a-zA-Z]+)\s(.+)$/);
          if (match) map[match[1]] = match[2];
          else map['_general'] = (map['_general'] ? map['_general'] + '; ' : '') + msg;
        });
        setBackendErrors(map);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // stay on step 7 with errors shown
      }
    } catch { alert('Network error. Check that the server is running.'); }
    finally { setLoading(false); }
  };

  /* ── Screen 0 ── */
  if (step === 0) return (
    <div style={{ minHeight: '100vh', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center" style={{ maxWidth: 560, padding: '0 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#003087', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>DMV</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 12 }}>APPLICATION FOR REPLACEMENT<br />PLATES, STICKERS, DOCUMENTS</h1>
        <div style={{ width: 48, height: 3, background: '#CC8A00', margin: '16px auto 24px' }} />
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
          Complete all sections of this form and submit to any DMV office or mail to:<br />
          <strong style={{ color: '#374151' }}>DMV, P.O. Box 942869, Sacramento, CA 94269-0001</strong><br /><br />
          <strong>NOTE:</strong> There is a fee to replace most items. If your address has changed, submit the appropriate Change of Address form.
          For current fee information, visit <strong>dmv.ca.gov</strong>, or call <strong>1-800-777-0133</strong>.
        </p>
        <button onClick={() => setStep(1)} style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 48px', fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
          Start Application
        </button>
      </div>
    </div>
  );

  /* ── Screen 8 ── */
  if (step === 8) return (
    <div style={{ minHeight: '100vh', background: '#F0F2F5' }}>
      <ProgressBar step={8} />
      <div className="container" style={{ maxWidth: 500 }}>
        <div className="text-center card border-0 shadow-sm" style={{ borderRadius: 12, padding: '48px 32px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', border: '3px solid #047857', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#047857', marginBottom: 8 }}>Form Created Successfully</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Your REG-156 form has been generated and downloaded automatically.</p>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
            Don't forget submit this form to any DMV office or mail to:<br />
            <strong style={{ color: '#374151' }}>DMV, P.O. Box 942869, Sacramento, CA 94269-0001</strong><br /><br />
          </p>
          <button onClick={() => { setStep(0); setForm(initForm); setFieldErrors({}); setBackendErrors({}); setSameAsPhysical(true); }}
                  style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );

  const wrap = (children: React.ReactNode) => (
    <div style={{ minHeight: '100vh', background: '#F0F2F5', paddingBottom: 48 }}>
      <ProgressBar step={step} />
      <div className="container" style={{ maxWidth: 760 }}>{children}</div>
    </div>
  );

  /* ── Screen 1: Vehicle ── */
  if (step === 1) return wrap(
    <SectionCard title="Vehicle Information">
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Vehicle License Plate / CF Number" id="lp" required value={form.vehicle.licensePlate}
                 onChange={v => { sv('licensePlate', v); clearErr('vehicle.licensePlate'); }}
                 error={fe('vehicle.licensePlate')} maxLength={8} />
        </div>
        <div className="col-md-6">
          <Field label="Make" id="make" required value={form.vehicle.make}
                 onChange={v => { sv('make', v); clearErr('vehicle.make'); }}
                 error={fe('vehicle.make')} maxLength={23} />
        </div>
        <div className="col-12">
          <Field label="Vehicle ID Number / Hull ID Number" id="vin" required value={form.vehicle.vin}
                 onChange={v => { sv('vin', v); clearErr('vehicle.vin'); }}
                 error={fe('vehicle.vin')} maxLength={17} />
        </div>
        <div className="col-md-6">
          <Field label="Disabled Person Placard Number" id="dp" value={form.vehicle.dpPlacardNumber}
                 onChange={v => { sv('dpPlacardNumber', v); clearErr('vehicle.dpPlacardNumber'); if (!v) sv('birthDate', ''); }}
                 error={fe('vehicle.dpPlacardNumber')} maxLength={30} />
        </div>
        <div className="col-md-6">
          <Field label="Birth Date (if DP Placard)" id="bd" value={form.vehicle.birthDate} type="date"
                 onChange={v => { sv('birthDate', v); clearErr('vehicle.birthDate'); }}
                 error={fe('vehicle.birthDate')} disabled={!form.vehicle.dpPlacardNumber.trim()} />
        </div>
        <div className="col-12">
          <Field label="Engine Number (Motorcycles Only)" id="eng" value={form.vehicle.engineNumber}
                 onChange={v => { sv('engineNumber', v); clearErr('vehicle.engineNumber'); }}
                 error={fe('vehicle.engineNumber')} maxLength={54} />
        </div>
      </div>
      <NavButtons onNext={() => goNext(2)} />
    </SectionCard>
  );

  /* ── Screen 2: Owner ── */
  if (step === 2) return wrap(
    <SectionCard title="Section 1 — Registered Owner of Record">
      <div className="row g-3">
        <div className="col-md-8">
          <Field label="True Full Name (Last, First, Middle) or Business Name" id="fn" required value={form.owner.fullName}
                 onChange={v => { so('fullName', v); clearErr('owner.fullName'); }}
                 error={fe('owner.fullName')} maxLength={80} />
        </div>
        <div className="col-md-4">
          <Field label="Driver License / ID Card Number" id="dl" value={form.owner.dlNumber} required
                 onChange={v => { so('dlNumber', v); clearErr('owner.dlNumber'); }}
                 error={fe('owner.dlNumber')} maxLength={8} />
        </div>

        <div className="col-md-12 card">
          <div className="row">
            <div className="col-md-12">Co-Owner</div>
            <div className="col-md-8">
              <Field label="True Full Name (Last, First, Middle)" id="co" value={form.owner.coOwnerName}
                     onChange={v => { so('coOwnerName', v); clearErr('owner.coOwnerName'); }}
                     error={fe('owner.coOwnerName')} maxLength={80} />
            </div>
            <div className="col-md-4">
              <Field label="Driver License / ID Card Number" id="dl2" value={form.owner.dl2Number}
                     onChange={v => { so('dl2Number', v); clearErr('owner.dl2Number'); }}
                     error={fe('owner.dl2Number')} maxLength={8} />
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <Field label="Physical Residence or Business Address" id="addr" value={form.owner.physicalAddress} required
                 onChange={v => { so('physicalAddress', v); clearErr('owner.physicalAddress'); }}
                 error={fe('owner.physicalAddress')} maxLength={48} />
        </div>
        <div className="col-md-3">
          <Field label="Apt / Space / Ste" id="apt" value={form.owner.apt} required
                 onChange={v => { so('apt', v); clearErr('owner.apt'); }}
                 error={fe('owner.apt')} maxLength={10} />
        </div>
        <div className="col-md-5">
          <Field label="City" id="city" value={form.owner.city} required
                 onChange={v => { so('city', v); clearErr('owner.city'); }}
                 error={fe('owner.city')} maxLength={30} />
        </div>
        <div className="col-md-3">
          <Field label="State" id="state" value={form.owner.state} placeholder="CA" required
                 onChange={v => { so('state', v.toUpperCase()); clearErr('owner.state'); }}
                 error={fe('owner.state')} maxLength={2} />
        </div>
        <div className="col-md-4">
          <Field label="Zip Code" id="zip" value={form.owner.zipCode} required
                 onChange={v => { so('zipCode', v.replace(/\D/g, '')); clearErr('owner.zipCode'); }}
                 error={fe('owner.zipCode')} maxLength={5} />
        </div>
        <div className="col-12">
          <Field label="County of Residence / County Where Vehicle is Primarily Garaged" id="county" value={form.owner.county}
                 onChange={v => { so('county', v); clearErr('owner.county'); }}
                 error={fe('owner.county')} maxLength={200} />
        </div>

        {/* Mailing section */}
        <div className="col-12">
          <div style={{ borderTop: '1px dashed #E5E7EB', paddingTop: 16, marginTop: 4 }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#6B7280' }}>
                Mailing Address (if different from physical)
              </span>
              <div className="form-check mb-0" style={{ paddingLeft: 26 }}>
                <input className="form-check-input" type="checkbox" id="samePhys" checked={sameAsPhysical}
                       onChange={e => setSameAsPhysical(e.target.checked)}
                       style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label className="form-check-label ms-2" htmlFor="samePhys" style={{ fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  Same as physical
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <Field label="Mailing Address" id="mail" value={form.owner.mailingAddress} disabled={sameAsPhysical}
                 onChange={v => { so('mailingAddress', v); clearErr('owner.mailingAddress'); }}
                 error={!sameAsPhysical ? fe('owner.mailingAddress') : undefined} maxLength={200} />
        </div>
        <div className="col-md-3">
          <Field label="Apt / Space / Ste" id="mapt" value={form.owner.mailingApt} disabled={sameAsPhysical}
                 onChange={v => { so('mailingApt', v); clearErr('owner.mailingApt'); }}
                 error={!sameAsPhysical ? fe('owner.mailingApt') : undefined} maxLength={10} />
        </div>
        <div className="col-md-5">
          <Field label="City" id="mcity" value={form.owner.mailingCity} disabled={sameAsPhysical}
                 onChange={v => { so('mailingCity', v); clearErr('owner.mailingCity'); }}
                 error={!sameAsPhysical ? fe('owner.mailingCity') : undefined} maxLength={30} />
        </div>
        <div className="col-md-3">
          <Field label="State" id="mstate" value={form.owner.mailingState} placeholder="CA" disabled={sameAsPhysical}
                 onChange={v => { so('mailingState', v.toUpperCase()); clearErr('owner.mailingState'); }}
                 error={!sameAsPhysical ? fe('owner.mailingState') : undefined} maxLength={2} />
        </div>
        <div className="col-md-4">
          <Field label="Zip Code" id="mzip" value={form.owner.mailingZipCode} disabled={sameAsPhysical}
                 onChange={v => { so('mailingZipCode', v.replace(/\D/g, '')); clearErr('owner.mailingZipCode'); }}
                 error={!sameAsPhysical ? fe('owner.mailingZipCode') : undefined} maxLength={5} />
        </div>
      </div>
      <NavButtons onBack={() => goBack(1)} onNext={() => goNext(3)} />
    </SectionCard>
  );

  /* ── Screen 3: Items ── */
  if (step === 3) return wrap(
    <SectionCard title="Section 2 — Plates, Stickers, Documents Request"
                 note="For replacement of missing License Plate, License Sticker, or Disabled Person Placard, if the original item is later located or received, the original item is no longer valid and must be destroyed or returned to DMV.">
      <div className="d-flex flex-column align-items-center">
        {([
          ['licensePlates', 'License Plates'],
          ['registrationCard', 'Registration Card'],
          ['licenseYearSticker', 'License Year Sticker'],
          ['licenseMonthSticker', 'License Month Sticker'],
          ['vesselYearSticker', 'Vessel (Boat) Year Sticker'],
          ['vesselCertificate', 'Vessel Certificate of Number'],
          ['vesselMusselFee', 'Vessel Mussel Fee Sticker'],
          ['dpPlacard', 'Disabled Person Placard'],
          ['dpIdCard', 'Disabled Person ID Card'],
          ['pnoCard', 'Planned Non-Operation (PNO) Card'],
          ['pfrSticker', 'PFR Sticker'],
          ['cvraWeightDecal', 'CVRA Weight Decal'],
          ['cvraYearSticker', 'CVRA Year Sticker'],
          ['trailerOhvIdCard', 'Trailer or OHV ID Card'],
        ] as [keyof ItemsForm, string][]).map(([key, label]) => (
          <CheckField key={key} label={label} id={key} checked={form.itemsRequested[key] as boolean} onChange={v => si(key, v)} />
        ))}
      </div>
      <NavButtons onBack={() => goBack(2)} onNext={() => goNext(4)} />
    </SectionCard>
  );

  /* ── Screen 4: Reason ── */
  if (step === 4) return wrap(
    <SectionCard title="Section 3 — The Item Requested Was (Check appropriate box(es))">
      <div className="d-flex flex-column">
        <CheckField label="Lost" id="lost"
                    checked={form.reason.lost}
                    onChange={v => sr('lost', v)} />
        <CheckField label="Stolen" id="stolen"
                    checked={form.reason.stolen}
                    onChange={v => sr('stolen', v)} />
        <CheckField label="Destroyed / Mutilated (remnants of the plate(s) must be surrendered to DMV)" id="destr"
                    checked={form.reason.destroyed}
                    onChange={v => sr('destroyed', v)} />
        <CheckField label="Not Received from DMV (Allow 30 days from issue date before reapplying)" id="nrdmv"
                    checked={form.reason.notReceivedFromDmv}
                    onChange={v => sr('notReceivedFromDmv', v)} />
        <CheckField label="Not Received from Prior Owner" id="nrpo"
                    checked={form.reason.notReceivedFromPriorOwner}
                    onChange={v => sr('notReceivedFromPriorOwner', v)} />
        <CheckField label="Surrendered" id="surr"
                    checked={form.reason.surrendered}
                    onChange={v => sr('surrendered', v)} />

        {/* Surrendered count — inline row */}
        <div className="d-flex align-items-center gap-3 flex-wrap my-1 w-100 ps-1 s3-checkbox-wrap">
          <span className="s3-checkbox-title">Number of plates surrendered to DMV:</span>
          <div className="d-flex gap-4">
            {[['surrenderedOne', 'One'], ['surrenderedTwo', 'Two']].map(([key, label]) => (
              <div key={key} className="form-check mb-0" style={{ paddingLeft: 24 }}>
                <input className="form-check-input" type="checkbox" id={key}
                       checked={form.reason[key as keyof ReasonForm] as boolean}
                       onChange={e => sr(key, e.target.checked)}
                       style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label className="form-check-label ms-1" htmlFor={key} style={{ fontSize: 14, cursor: 'pointer' }}>{label}</label>
              </div>
            ))}
          </div>
        </div>

        <CheckField label="Special Plates were Retained by Owner (Personalized, Disabled Person, Disabled Veteran)" id="spr"
                    checked={form.reason.specialPlatesRetained}
                    onChange={v => sr('specialPlatesRetained', v)} />
        <CheckField label="Requesting Registration Card with Current Address" id="rcc"
                    checked={form.reason.regCardCurrentAddress}
                    onChange={v => sr('regCardCurrentAddress', v)} />
        <CheckField label="Per CVC §4467 – Copy of a police report, court documentation, or other law enforcement documentation required." id="cvc"
                    checked={form.reason.cvcSection}
                    onChange={v => sr('cvcSection', v)} />
        <CheckField label="Other" id="other"
                    checked={form.reason.other}
                    onChange={v => { sr('other', v); if (!v) { sr('explanation', ''); clearErr('reason.explanation'); } }} />
      </div>

      {form.reason.other && (
        <div className="mt-3" style={{ maxWidth: 560, margin: '12px auto 0' }}>
          <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#374151' }}>
            Explain: <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <textarea className={`form-control${fe('reason.explanation') ? ' is-invalid' : ''}`}
                    rows={3} value={form.reason.explanation} maxLength={500}
                    onChange={e => { sr('explanation', e.target.value); clearErr('reason.explanation'); }}
                    style={{ borderRadius: 6, fontSize: 14, resize: 'vertical', paddingRight: fe('reason.explanation') ? '2.6rem' : '12px' }} />
          {fe('reason.explanation') && <div className="invalid-feedback d-block" style={{ fontSize: 12 }}>{fe('reason.explanation')}</div>}
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{form.reason.explanation.length}/500</div>
        </div>
      )}

      <NavButtons onBack={() => goBack(3)} onNext={() => goNext(5)} />
    </SectionCard>
  );

  /* ── Screen 5: Plate Info ── */
  if (step === 5) return wrap(
    <SectionCard title="Section 4 — License Plate">
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
        <strong>Complete only if address is different than DMV records (CVC §4466).</strong><br />
        If the license plate(s) were stolen or missing and your address is different from the department's records, you must appear in person at a DMV office and bring: 1) An original or photocopy of proof of ownership; 2) Your Driver License or Identification Card; 3) If stolen, a copy of the police report; 4) If duplicate license plates have been issued within the last 90 days, a CHP verification of the VIN is required.
      </p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Check appropriate box:</p>
      <CheckField disabled label="One license plate missing (automobiles/two-plate commercial vehicles/pick-ups only). The remaining plate must be surrendered to DMV." id="one" checked={form.reason.oneLicensePlate} />
      <CheckField disabled label="Two license plates are missing or one license plate is missing for a single-plate commercial truck tractor, motorcycle, or trailer. The registered owner must immediately notify a law enforcement agency." id="two" checked={form.reason.twoLicensePlates} />
      <NavButtons onBack={() => goBack(4)} onNext={() => goNext(6)} />
    </SectionCard>
  );

  /* ── Screen 6: Certification ── */
  if (step === 6) return wrap(
    <SectionCard title="Section 5 — Certification">
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
        The registered owner mailing address is valid, existing, and an accurate mailing address. I consent to receive service of process at this mailing address pursuant to CVC §1808.21, Code of Civil Procedure §§415.21(b), 415.30(a), and 416.90.<br /><br />
        <strong>I certify (or declare) under penalty of perjury under the laws of the State of California that the foregoing is true and correct.</strong>
      </p>
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Print True Full Name" id="pname" value={form.certification.printName} required
                 onChange={v => { sc('printName', v); clearErr('certification.printName'); }} error={fe('certification.printName')} maxLength={35} />
        </div>
        <div className="col-md-6">
          <Field label="Title (if signing for company)" id="ctitle" value={form.certification.title}
                 onChange={v => { sc('title', v); clearErr('certification.title'); }} error={fe('certification.title')} maxLength={40} />
        </div>


        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#374151' }}>Telephone Number <span style={{color: 'rgb(220, 38, 38)', marginLeft: 3}}>*</span></label>
          <input type="tel" className={`form-control${(fe('certification.areaCode') || fe('certification.telephoneNumber')) ? ' is-invalid' : ''}`}
                 value={form.certification.phone} placeholder="(XXX) XXX-XX-XXXX"
                 onChange={e => { sc('phone', formatPhone(e.target.value)); clearErr('certification.phone'); }}
                 style={{ borderRadius: 6, fontSize: 14, padding: '8px 12px', paddingRight: fe('certification.phone') ? '2.6rem' : '12px', borderColor: fe('certification.phone') ? '#DC2626' : '#D1D5DB' }} />
          {(fe('certification.areaCode') || fe('certification.telephoneNumber'))
            && <div className="invalid-feedback d-block" style={{ fontSize: 12 }}>
              {fe('certification.areaCode') ? fe('certification.areaCode') : fe('certification.telephoneNumber')}
          </div>}
        </div>


        <div className="col-md-6">
          <Field label="Date" id="certdate" value={form.certification.date} type="date" required
                 onChange={v => { sc('date', v); clearErr('certification.date'); }} error={fe('certification.date')} />
        </div>
        <div className="col-12">
          <Field label="Email Address" id="email" value={form.certification.email} type="email"
                 onChange={v => { sc('email', v); clearErr('certification.email'); }} error={fe('certification.email')} maxLength={50} />
        </div>
      </div>
      <NavButtons onBack={() => goBack(5)} onNext={() => goNext(7)} nextLabel="Review" />
    </SectionCard>
  );

  /* ── Screen 7: Review ── */
  if (step === 7) {
    const hasBackendErrors = Object.keys(backendErrors).filter(k => k !== '_general').length > 0;
    const digits = (line: string) => line.replace(/\D/g, '');

    const ITEMS_MAP: [keyof ItemsForm, string][] = [
      ['licensePlates', 'License Plates'],
      ['registrationCard', 'Registration Card'],
      ['licenseYearSticker', 'License Year Sticker'],
      ['licenseMonthSticker', 'License Month Sticker'],
      ['vesselYearSticker', 'Vessel (Boat) Year Sticker'],
      ['vesselCertificate', 'Vessel Certificate of Number'],
      ['vesselMusselFee', 'Vessel Mussel Fee Sticker'],
      ['dpPlacard', 'Disabled Person Placard'],
      ['dpIdCard', 'Disabled Person ID Card'],
      ['pnoCard', 'Planned Non-Operation (PNO) Card'],
      ['pfrSticker', 'PFR Sticker'],
      ['cvraWeightDecal', 'CVRA Weight Decal'],
      ['cvraYearSticker', 'CVRA Year Sticker'],
      ['trailerOhvIdCard', 'Trailer or OHV ID Card'],
    ];
    const REASON_MAP: [keyof ReasonForm, string][] = [
      ['lost', 'Lost'],
      ['stolen', 'Stolen'],
      ['destroyed', 'Destroyed / Mutilated'],
      ['notReceivedFromDmv', 'Not Received from DMV'],
      ['notReceivedFromPriorOwner', 'Not Received from Prior Owner'],
      ['surrendered', 'Surrendered'],
      ['surrenderedOne', 'One plate surrendered'],
      ['surrenderedTwo', 'Two plates surrendered'],
      ['specialPlatesRetained', 'Special Plates Retained by Owner'],
      ['regCardCurrentAddress', 'Registration Card w/ Current Address'],
      ['cvcSection', 'Per CVC §4467'],
      ['other', 'Other'],
    ];
    const be = backendErrors;

    return wrap(
      <div>
        {hasBackendErrors && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#991B1B', fontSize: 13, padding: '12px 16px', marginBottom: 20 }}>
            <div className="pb-2"><strong>⚠ You have errors.</strong> Please go back and correct the highlighted fields.</div>
            <div>
              {Object.entries(backendErrors).map(([field, error]) => (
                <div key={field}>
                  <strong>{dict(field)}:</strong> {error}
                </div>
              ))}
            </div>
          </div>
        )}

        <SectionCard title="Vehicle Information">
          <RvRow label="License Plate / CF Number" value={form.vehicle.licensePlate} errorKey="vehicle.licensePlate" be={be} />
          <RvRow label="Make" value={form.vehicle.make} errorKey="vehicle.make" be={be} />
          <RvRow label="VIN / Hull ID Number" value={form.vehicle.vin} errorKey="vehicle.vin" be={be} />
          <RvRow label="DP Placard Number" value={form.vehicle.dpPlacardNumber} errorKey="vehicle.dpPlacardNumber" be={be} />
          <RvRow label="Birth Date (if DP Placard)" value={form.vehicle.birthDate} errorKey="vehicle.birthDate" be={be} />
          <RvRow label="Engine Number" value={form.vehicle.engineNumber} errorKey="vehicle.engineNumber" be={be} />
        </SectionCard>

        <SectionCard title="Section 1 — Registered Owner">
          <RvRow label="Full Name" value={form.owner.fullName} errorKey="owner.fullName" be={be} />
          <RvRow label="DL / ID Number" value={form.owner.dlNumber} errorKey="owner.dlNumber" be={be} />
          <RvRow label="Co-Owner Name" value={form.owner.coOwnerName} errorKey="owner.coOwnerName" be={be} />
          <RvRow label="Co-Owner DL / ID Number" value={form.owner.dl2Number} errorKey="owner.dl2Number" be={be} />
          <RvRow label="Physical Address" value={form.owner.physicalAddress} errorKey="owner.physicalAddress" be={be} />
          <RvRow label="Apt / Space / Ste" value={form.owner.apt} errorKey="owner.apt" be={be} />
          <RvRow label="City" value={form.owner.city} errorKey="owner.city" be={be} />
          <RvRow label="State" value={form.owner.state} errorKey="owner.state" be={be} />
          <RvRow label="Zip Code" value={form.owner.zipCode} errorKey="owner.zipCode" be={be} />
          <RvRow label="County" value={form.owner.county} errorKey="owner.county" be={be} />
          <RvRow label="Mailing Address" value={sameAsPhysical ? 'Same as physical address' : form.owner.mailingAddress} errorKey="owner.mailingAddress" be={be} />
          {!sameAsPhysical && <>
            <RvRow label="Mailing Apt / Space / Ste" value={form.owner.mailingApt} errorKey="owner.mailingApt" be={be} />
            <RvRow label="Mailing City" value={form.owner.mailingCity} errorKey="owner.mailingCity" be={be} />
            <RvRow label="Mailing State" value={form.owner.mailingState} errorKey="owner.mailingState" be={be} />
            <RvRow label="Mailing Zip Code" value={form.owner.mailingZipCode} errorKey="owner.mailingZipCode" be={be} />
          </>}
        </SectionCard>

        <SectionCard title="Section 2 — Items Requested">
          {ITEMS_MAP.map(([key, label]) => (
            <RvChk key={key} label={label} checked={form.itemsRequested[key] as boolean} />
          ))}
        </SectionCard>

        <SectionCard title="Section 3 — The Item Requested Was">
          {REASON_MAP.map(([key, label]) => (
            <RvChk key={key} label={label} checked={form.reason[key] as boolean} />
          ))}
          <RvRow label="Explanation" value={form.reason.explanation} errorKey="reason.explanation" be={be} />
        </SectionCard>

        <SectionCard title="Section 4 — License Plate">
          <RvChk label="One license plate missing" checked={form.reason.oneLicensePlate} />
          <RvChk label="Two license plates missing" checked={form.reason.twoLicensePlates} />
        </SectionCard>

        <SectionCard title="Section 5 — Certification">
          <RvRow label="Print Name" value={form.certification.printName} errorKey="certification.printName" be={be} />
          <RvRow label="Title" value={form.certification.title} errorKey="certification.title" be={be} />
          <RvRow label="Phone code" value={digits(form.certification.phone).length >= 3 ? digits(form.certification.phone).slice(0, 3) : "-"} errorKey="certification.areaCode" be={be} />
          <RvRow label="Phone number" value={digits(form.certification.phone).length > 3 ? digits(form.certification.phone).slice(3) : "-"} errorKey="certification.telephoneNumber" be={be} />
          <RvRow label="Date" value={form.certification.date} errorKey="certification.date" be={be} />
          <RvRow label="Email" value={form.certification.email} errorKey="certification.email" be={be} />
        </SectionCard>

        <NavButtons onBack={() => goBack(6)} onNext={handleSubmit} nextLabel="Create Form" loading={loading} />
      </div>
    );
  }

  return null;
}
