export interface User {
  email: string;
  password: string;
  konfirmasiPassword: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  gender?: string;
  phone?: number;
  countryCode?: string;
  id: string;
  name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
