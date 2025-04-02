import type { UserSex } from '../../../../../utils/userState/UserState.types.ts';

export interface UpdateUserOutputDto {
  id?: number;
  updatedData?: {
    username?: string;
    age?: Date;
    gender?: UserSex;
  };
}
