export interface CreateAdditionInputDto {
  userId: number | null;
  averageCallbackTime: number;
  dispersion: number;
  allSignals: number;
  mistakes: number;
  testBlockId?: number;
}
