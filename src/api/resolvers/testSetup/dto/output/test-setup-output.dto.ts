import type { AccelerationMode } from '../../../../../pages/tests/types';

export interface TestSetupOutputDTO {
  id: number,
  testName: string,
  testTypeId: number,
  duration: number,
  showTimer: boolean,
  showTotalResults: boolean,
  showProgress: boolean,
  accelerationMode: AccelerationMode,
  createdAt: string,
  updatedAt: string
}