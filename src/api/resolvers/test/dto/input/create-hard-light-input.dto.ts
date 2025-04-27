export interface CreateHardLightInputDto {
  userId: number | null;
  averageCallbackTime: number;
  allSignals: number;
  misclicks: number;
  mistakes: number;
  dispersion: number;
}
