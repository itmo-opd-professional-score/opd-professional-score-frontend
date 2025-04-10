export interface CreateSoundAdditionInputDto {
  userId: number | null;
  averageCallbackTime: number;
  dispersion: number;
  allSignals: number;
  mistakes: number;
}
