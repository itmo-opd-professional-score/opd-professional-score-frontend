import type { AccelerationMode } from '../../../../../pages/tests/types';

export interface TestSetupInputDto {
  testName: string;
  testTypeId: number;
  duration: number;
  showTimer: boolean;
  showTotalResults: boolean;
  showProgress: boolean;
  accelerationMode: AccelerationMode;
}