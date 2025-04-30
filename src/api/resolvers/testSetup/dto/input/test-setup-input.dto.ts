import type { AccelerationMode } from '../../../../../pages/tests/types';

export interface TestSetupInputDto {
  testTypeId: number;
  duration: number;
  showTimer: boolean;
  showTotalResults: boolean;
  showProgress: boolean;
  accelerationMode: AccelerationMode;
  difficultyMode: boolean;
}