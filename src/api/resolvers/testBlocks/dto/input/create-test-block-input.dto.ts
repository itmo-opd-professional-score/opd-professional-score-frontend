import type { TestBlockTest } from '../../../../../pages/tests/types';

export interface CreateTestBlockInputDto {
  tests: TestBlockTest[];
  userIDs: number[];
}
