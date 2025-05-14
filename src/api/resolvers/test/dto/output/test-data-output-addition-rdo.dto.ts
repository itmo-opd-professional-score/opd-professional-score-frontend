import type { TestDataOutputDto } from './test-data-output.dto.ts';

export interface TestDataOutputAdditionRdoDto extends TestDataOutputDto {
  averageCallbackTime: number;
  dispersion: number;
  allSignals: number,
  mistakes: number,
}