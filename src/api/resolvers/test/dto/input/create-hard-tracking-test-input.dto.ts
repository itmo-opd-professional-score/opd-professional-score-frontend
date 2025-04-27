export interface CreateHardTrackingTestInputDto {
  userId: number | null;
  duration: number;
  totalOverlapTime: number;
  bestOverlap: number;
  averageOverlap: number;
  overlapCount: number;
  successRate: number;
}