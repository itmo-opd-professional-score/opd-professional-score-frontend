import type { UpdatableProfessionValuesInputDto } from './updatable-profession-values-input.dto.ts';

export interface UpdateProfessionInputDto {
  id: number;
  updatedData: UpdatableProfessionValuesInputDto;
}
