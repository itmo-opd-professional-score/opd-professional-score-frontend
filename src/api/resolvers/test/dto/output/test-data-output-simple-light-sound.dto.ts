import type { TestDataOutputDto } from './test-data-output.dto.ts';

export interface TestDataOutputSimpleLightSoundDto extends TestDataOutputDto {
  averageCallbackTime: number;
  allSignals: number;
  misclicks: number;
  dispersion: number;
}