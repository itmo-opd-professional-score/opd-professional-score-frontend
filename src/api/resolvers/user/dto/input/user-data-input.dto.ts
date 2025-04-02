import type { UserRole } from '../../../../../utils/userState/UserState.types.ts';

export interface UserDataInputDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  password: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}
