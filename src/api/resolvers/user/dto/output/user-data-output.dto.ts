import type { UserRole, UserSex } from '../../../../../utils/userState/UserState.types.ts';

export interface UserDataOutputDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  age: string;
  gender: UserSex;
  password: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}
