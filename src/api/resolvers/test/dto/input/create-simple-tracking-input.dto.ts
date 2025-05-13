export interface CreateSimpleTrackingInputDto {
  userId: number | null;
  allSignals: number;
  score: number;
  averageCallbackTime: number;
  dispersion: number;
}