import type { TestBlockTest } from '../../../../../pages/tests/types';

export interface UpdateTestBlockInputDto {
  testBlockId: number;
  updatedTest: TestBlockTest
}