interface VehicleForm {
  licensePlate: string;
  make: string;
  vin: string;
  dpPlacardNumber: string;
  birthDate: string;
  engineNumber: string;
}

interface OwnerForm {
  fullName: string;
  dlNumber: string;
  coOwnerName: string;
  dl2Number: string;
  physicalAddress: string;
  apt: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  mailingAddress: string;
  mailingApt: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
}

interface ItemsForm {
  licensePlates: boolean;
  registrationCard: boolean;
  licenseYearSticker: boolean;
  licenseMonthSticker: boolean;
  vesselYearSticker: boolean;
  vesselCertificate: boolean;
  vesselMusselFee: boolean;
  dpPlacard: boolean;
  dpIdCard: boolean;
  pnoCard: boolean;
  pfrSticker: boolean;
  cvraWeightDecal: boolean;
  cvraYearSticker: boolean;
  trailerOhvIdCard: boolean;
}

interface ReasonForm {
  lost: boolean;
  stolen: boolean;
  destroyed: boolean;
  notReceivedFromDmv: boolean;
  notReceivedFromPriorOwner: boolean;
  surrendered: boolean;
  surrenderedOne: boolean;
  surrenderedTwo: boolean;
  specialPlatesRetained: boolean;
  regCardCurrentAddress: boolean;
  cvcSection: boolean;
  other: boolean;
  oneLicensePlate: boolean;
  twoLicensePlates: boolean;
  explanation: string;
}

interface CertForm {
  printName: string;
  title: string;
  phone: string;
  date: string;
  email: string;
}

interface FormState {
  vehicle: VehicleForm;
  owner: OwnerForm;
  itemsRequested: ItemsForm;
  reason: ReasonForm;
  certification: CertForm;
}
