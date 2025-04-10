import type { UserSex } from '../../../../../utils/userState/UserState.types.ts';

export interface UpdateUserInputDto {
  id?: number;
  updatedData?: {
    username?: string;
    age?: Date;
    gender?: UserSex;
  };
}
