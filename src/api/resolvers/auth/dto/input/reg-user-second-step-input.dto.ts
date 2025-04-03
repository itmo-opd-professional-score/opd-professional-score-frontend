import type { UserDataInputDto } from './user-data-input.dto.ts';

export interface RegUserSecondStepInputDto {
  userData: UserDataInputDto;
  code: number;
}
