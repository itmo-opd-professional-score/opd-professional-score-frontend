export interface CreateSimpleTrackingInputDto {
  userId: number | null;
  allSignals: number;
  successCount: number;
  avgTime: number;
  timeDeviation: number;
  testBlockId?: number;
}