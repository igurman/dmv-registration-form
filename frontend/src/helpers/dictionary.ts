export const dictionary: Record<string, string> = {
  'vehicle.licensePlate': 'Vehicle -> Vehicle License Plate / CF Number',
  'vehicle.make': 'Vehicle -> Make',
  'vehicle.vin': 'Vehicle -> Vehicle ID Number / Hull ID Number',
  'vehicle.dpPlacardNumber': 'Vehicle -> Disabled Person Placard Number',
  'vehicle.birthDate': 'Vehicle -> Birth Date',
  'vehicle.engineNumber': 'Vehicle -> Engine Number',
  'owner.fullName': "Owner -> True Full Name or Business Name",
  'owner.dlNumber': "Owner -> Driver License / ID Card Number",
  'owner.coOwnerName': "Owner -> Co-Owner True Full Name",
  'owner.dl2Number': "Owner -> Co-Owner Driver License / ID Card Number",
  'owner.physicalAddress': "Owner -> Physical Residence or Business Address",
  'owner.apt': "Owner -> Apt / Space / Ste",
  'owner.city': "Owner -> City",
  'owner.state': "Owner -> State",
  'owner.zipCode': "Owner -> Zip Code",
  'owner.county': "Owner -> County of Residence / County",
  'owner.mailingAddress': "Owner -> Mailing Address",
  'owner.mailingApt': "Owner -> Apt / Space / Ste",
  'owner.mailingCity': "Owner -> City",
  'owner.mailingState': "Owner -> State",
  'owner.mailingZipCode': "Owner -> Zip Code",
  'certification.printName': 'Certification -> Print True Full Name',
  'certification.title': 'Certification -> Title',
  'certification.areaCode': 'Certification -> Telephone Code',
  'certification.telephoneNumber': 'Certification -> Telephone Number',
  'certification.date': 'Certification -> Date',
  'certification.email': 'Certification -> Email Address'
} as const;

export function dict(field?: string): string {
  if (!field) return '';

  return dictionary[field] || field;
}
