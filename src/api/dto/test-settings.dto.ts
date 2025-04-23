export interface TestSettingsDto {
  testType: string;
  duration: number;
  showTimer: boolean;
  showMinuteResults: boolean;
  showTotalResults: boolean;
  showProgress: boolean;
  accelerationAmount: number;
  accelerationInterval: number;
  accelerationFrequency: number;
  difficulty: number;
}