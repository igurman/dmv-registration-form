export function buildPayload(form: FormState, sameAsPhysical: boolean) {
  const clean = (s: string) => s.trim() || undefined;
  const numOrUndef = (s: string) => s.trim() ? Number(s) : undefined;
  const digits = form.certification.phone.replace(/\D/g, '');
  return {
    vehicle: {
      licensePlate: form.vehicle.licensePlate,
      make: form.vehicle.make,
      vin: form.vehicle.vin,
      dpPlacardNumber: clean(form.vehicle.dpPlacardNumber),
      birthDate: form.vehicle.birthDate || undefined,
      engineNumber: clean(form.vehicle.engineNumber),
    },
    owner: {
      fullName: clean(form.owner.fullName),
      dlNumber: clean(form.owner.dlNumber),
      coOwnerName: clean(form.owner.coOwnerName),
      dl2Number: clean(form.owner.dl2Number),
      physicalAddress: clean(form.owner.physicalAddress),
      apt: clean(form.owner.apt),
      city: clean(form.owner.city),
      state: clean(form.owner.state),
      zipCode: numOrUndef(form.owner.zipCode),
      county: clean(form.owner.county),
      mailingAddress: sameAsPhysical ? undefined : clean(form.owner.mailingAddress),
      mailingApt: sameAsPhysical ? undefined : clean(form.owner.mailingApt),
      mailingCity: sameAsPhysical ? undefined : clean(form.owner.mailingCity),
      mailingState: sameAsPhysical ? undefined : clean(form.owner.mailingState),
      mailingZipCode: sameAsPhysical ? undefined : numOrUndef(form.owner.mailingZipCode),
    },
    itemsRequested: form.itemsRequested,
    reason: { ...form.reason, explanation: clean(form.reason.explanation) },
    certification: {
      printName: clean(form.certification.printName),
      title: clean(form.certification.title),
      areaCode: digits.length >= 3 ? Number(digits.slice(0, 3)) : undefined,
      telephoneNumber: digits.length > 3 ? digits.slice(3) : undefined,
      date: form.certification.date || undefined,
      email: clean(form.certification.email),
    },
  };
}