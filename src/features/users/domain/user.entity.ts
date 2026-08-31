export type UserRole = 'ADMIN' | 'BENEVOLE' | 'RESPONSABLE';

export interface UserEntity {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = {
  email: string;
  name?: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  password?: string;
  isActive?: boolean;
};