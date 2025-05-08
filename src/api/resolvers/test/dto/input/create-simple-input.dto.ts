export interface CreateSimpleInputDto {
  userId: number | null;
  averageCallbackTime: number;
  allSignals: number;
  misclicks: number;
  dispersion: number;
  testBlockId?: number;
}
