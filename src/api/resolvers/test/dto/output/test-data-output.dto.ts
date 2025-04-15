export type TestDataOutputDto = MistakesOutputDto | MisclicksOutputDto

interface MistakesOutputDto {
  id: number;
  testTypeId: number;
  userId: number;
  averageCallbackTime: number;
  allSignals: number;
  dispersion: number;
  valid: boolean;
  createdAt: string;
  updatedAt: string;

  misclicks: number;
  mistakes?: undefined;
}

interface MisclicksOutputDto {
  id: number;
  testTypeId: number;
  userId: number;
  averageCallbackTime: number;
  allSignals: number;
  dispersion: number;
  valid: boolean;
  createdAt: string;
  updatedAt: string;

  mistakes: number;
  misclicks?: undefined;
}
