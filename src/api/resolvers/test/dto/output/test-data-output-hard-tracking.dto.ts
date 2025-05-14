import type { TestDataOutputDto } from './test-data-output.dto.ts';

export interface TestDataOutputHardTrackingDto extends TestDataOutputDto {
  duration: number;
  totalOverlapTime: number;
  bestOverlap: number;
  averageOverlap: number;
  overlapCount: number;
  score: number;
}