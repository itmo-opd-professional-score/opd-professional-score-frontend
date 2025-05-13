import type { TestType } from '../../../../../pages/tests/types';

export interface TestBatteryOutputDto {
  id: number;
  name: string
  description: string
  tests: {
    id: number;
    name: TestType;
    setupId: number | null;
    testBatteryId: number;
  }[]
  updatedAt: string;
  createdAt: string;
}
