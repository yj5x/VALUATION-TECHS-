export interface User {
  id: string;
  email: string;
  name: string;
  license_number?: string;
  membership_category?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  license_number?: string;
  membership_category?: string;
}

