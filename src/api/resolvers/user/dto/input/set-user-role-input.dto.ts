import type { UserRole } from '../../../../../utils/userState/UserState.types.ts';

export interface SetUserRoleInputDto {
  id: number;
  role: UserRole;
}
