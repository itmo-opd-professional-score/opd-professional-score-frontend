export interface TestDataInputDto {
  id: number;
  testTypeId: number;
  userId: number;
  averageCallbackTime: number;
  allSignals: number;
  misclicks: number;
  dispersion: number;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
}
