export interface Doctor {
  _id?: string;
  name: string;
  speciality: string;
  experience?: number;
  qualification?: string;
  consultationFee?: number;
//   availableDays?: string[];
  image?: string;
}
