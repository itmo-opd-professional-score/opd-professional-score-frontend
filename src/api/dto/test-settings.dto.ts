import type { AccelerationMode } from '../../pages/tests/types';

export interface TestSettingsDto {
  testType: string;
  duration: number;
  showTimer: boolean;
  showTotalResults: boolean;
  showProgress: boolean;
  accelerationMode: AccelerationMode;
  difficultyMode: boolean;
}