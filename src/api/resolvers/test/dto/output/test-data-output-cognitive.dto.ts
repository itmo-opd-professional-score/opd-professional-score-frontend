import type { TestDataOutputDto } from './test-data-output.dto.ts';

export interface TestDataOutputCognitiveDto extends TestDataOutputDto {
  allSignals: number;
  score: number;
  mistakes: number;
}