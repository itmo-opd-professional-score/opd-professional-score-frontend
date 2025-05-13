import type { TestType } from '../../../../../pages/tests/types';

export interface CreateTestBatteryInputDto {
  name: string;
  description: string;
  tests: {
    name: TestType;
    setupId: number | null;
  }[]
}
