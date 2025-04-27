import type { CreateAdditionInputDto } from './create-addition-input.dto.ts';
import type { TestType } from '../../../../../pages/tests/types';

export interface CreateRdoInputDto extends CreateAdditionInputDto{
  testType: TestType
}