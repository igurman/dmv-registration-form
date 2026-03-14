export function validateStep(step: number, form: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    const v = form.vehicle;
    if (!v.licensePlate.trim()) e['vehicle.licensePlate'] = 'This field is required';
    else if (v.licensePlate.length > 8) e['vehicle.licensePlate'] = 'Maximum 8 characters';
    if (!v.make.trim()) e['vehicle.make'] = 'This field is required';
    else if (v.make.length > 23) e['vehicle.make'] = 'Maximum 23 characters';
    if (!v.vin.trim()) e['vehicle.vin'] = 'This field is required';
    else if (v.vin.length > 17) e['vehicle.vin'] = 'Maximum 17 characters';
    if (v.dpPlacardNumber.length > 30) e['vehicle.dpPlacardNumber'] = 'Maximum 30 characters';
    if (v.engineNumber.length > 54) e['vehicle.engineNumber'] = 'Maximum 54 characters';
  }
  if (step === 2) {
    const o = form.owner;
    if (!o.fullName.length) e['owner.fullName'] = 'This field is required';
    if (o.fullName.length > 80) e['owner.fullName'] = 'Maximum 80 characters';

    if (!o.dlNumber.length) e['owner.dlNumber'] = 'This field is required';
    if (o.dlNumber.length > 8) e['owner.dlNumber'] = 'Maximum 8 characters';

    if (o.coOwnerName.length > 80) e['owner.coOwnerName'] = 'Maximum 80 characters';
    if (o.dl2Number.length > 8) e['owner.dl2Number'] = 'Maximum 8 characters';

    if (!o.physicalAddress.length) e['owner.physicalAddress'] = 'This field is required';
    if (o.physicalAddress.length > 48) e['owner.physicalAddress'] = 'Maximum 48 characters';

    if (!o.apt.length) e['owner.apt'] = 'This field is required';
    if (o.apt.length > 10) e['owner.apt'] = 'Maximum 10 characters';

    if (!o.city.length) e['owner.city'] = 'This field is required';
    if (o.city.length > 30) e['owner.city'] = 'Maximum 30 characters';

    if (!o.state.length) e['owner.state'] = 'This field is required';
    if (o.state.length > 2) e['owner.state'] = 'Maximum 2 characters';

    if (!o.zipCode) e['owner.zipCode'] = 'This field is required';
    if (o.zipCode && (!/^\d+$/.test(o.zipCode) || Number(o.zipCode) > 99999)) e['owner.zipCode'] = 'Valid 5-digit zip required';

    if (o.county.length > 200) e['owner.county'] = 'Maximum 200 characters';
    if (o.mailingAddress.length > 200) e['owner.mailingAddress'] = 'Maximum 200 characters';
    if (o.mailingApt.length > 10) e['owner.mailingApt'] = 'Maximum 10 characters';
    if (o.mailingCity.length > 30) e['owner.mailingCity'] = 'Maximum 30 characters';
    if (o.mailingState.length > 2) e['owner.mailingState'] = 'Maximum 2 characters';
    if (o.mailingZipCode && (!/^\d+$/.test(o.mailingZipCode) || Number(o.mailingZipCode) > 99999)) e['owner.mailingZipCode'] = 'Valid 5-digit zip required';
  }
  if (step === 6) {
    const c = form.certification;
    if (!c.printName.length) e['certification.printName'] = 'This field is required';
    if (c.printName.length > 35) e['certification.printName'] = 'Maximum 35 characters';

    if (c.title.length > 40) e['certification.title'] = 'Maximum 40 characters';
    const digits = c.phone.replace(/\D/g, '');

    if (!c.phone) e['certification.phone'] = 'This field is required';
    if (c.phone && digits.length < 10) e['certification.phone'] = 'Enter a complete 10-digit phone number';

    if (c.email.length > 50) e['certification.email'] = 'Maximum 50 characters';
    if (form.reason.explanation.length > 500) e['reason.explanation'] = 'Maximum 500 characters';
  }
  return e;
}