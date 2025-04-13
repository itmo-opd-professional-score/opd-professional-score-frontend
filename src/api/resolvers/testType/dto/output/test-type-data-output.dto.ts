import type { TestType } from '../../../../../pages/tests/types';

export interface TestTypeDataOutputDto {
  id: number;
  name: TestType;
  description: string;
  createdAt: string;
  updatedAt: string;
}
