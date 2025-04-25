import type { accelerationMode } from '../../pages/tests/types';

export interface TestSettingsDto {
  testType: string;
  duration: number;
  showTimer: boolean;
  showTotalResults: boolean;
  showProgress: boolean;
  accelerationMode: accelerationMode;
  difficultyMode: boolean;
}