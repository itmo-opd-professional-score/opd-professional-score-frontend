export interface CreateTrackingInputDto {
  userId: string | null;
  allSignals: number;
  successCount: number;
  avgTime: number;
  timeDeviation: number;
}