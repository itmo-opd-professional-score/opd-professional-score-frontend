export interface CreateHardTrackingInputDto {
  userId: number | null;
  duration: number;
  totalOverlapTime: number;
  bestOverlap: number;
  averageOverlap: number;
  overlapCount: number;
  score: number;
}