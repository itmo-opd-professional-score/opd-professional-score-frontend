import type { TestType } from '../../../../../pages/tests/types';

export interface CreateCognitiveInputDto {
  userId?: number;
  allSignals: number;
  score: number;
  mistakes: number;
  testType: TestType
  testBlockId?: number;
}