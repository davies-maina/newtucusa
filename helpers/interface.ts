export const enum Icon {
  Success = '$success',
  Error = '$error',
  Info = '$info',
}

export enum Color {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export enum Text {
  Success = 'Operation completed successfully',
  Error = 'An error occurred',
  Info = "Here's some info",
  Email = 'Email sent'
}

export interface Iopportunity {
  title: string,
  desc: string,
  provider: string,
  providername: string
  ward: string,
  constituency: string
  id?: string
  opportunity: string
  archive: boolean
  createdAt?: Date
  pdf?: string | null
  pdfPath?: string | null

}
export interface UserProfile {
  id: string,
  academicprogram: string;
  address: string;
  constituency: string;
  coursecategory: string;
  coursetaken: string;
  dob: string;
  firstname: string;
  gender: string;
  institutioncounty: string;
  institutionname: string;
  institutiontype: string;
  lastname: string;
  location: string;
  nationalid: number;
  phonenumber: string;
  postalcode: string;
  schoolid: string;
  ward: string;
}
