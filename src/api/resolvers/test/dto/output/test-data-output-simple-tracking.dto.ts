import type { TestDataOutputDto } from './test-data-output.dto.ts';

export interface TestDataOutputSimpleTrackingDto extends TestDataOutputDto {
  allSignals: number;
  score: number;
  averageCallbackTime: number;
  dispersion: number;
}