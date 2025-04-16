export interface TestSetupOutputDTO {
  id: number,
  testName: string,
  testTypeId: number,
  duration: number,
  showTimer: boolean,
  showMinuteResults: boolean,
  showTotalResults: boolean,
  showProgress: boolean,
  accelerationAmount: number,
  accelerationInterval: number,
  accelerationFrequency: number,
  createdAt: string,
  updatedAt: string
}