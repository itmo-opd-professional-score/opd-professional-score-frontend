export type TestType =
  | 'ADDITION_SOUND'
  | 'ADDITION_VISUAL'
  | 'SIMPLE_LIGHT'
  | 'SIMPLE_SOUND'
  | 'HARD_LIGHT'
  | 'SIMPLE_RDO'
  | 'HARD_RDO'
  | 'SIMPLE_TRACKING'
  | 'HARD_TRACKING'
export interface TestJwt {
  testId: number | null;
  testType: TestType;
  iat: number;
  exp: number;
}
export type AccelerationMode =
  | 'DISCRETE'
  | 'STEADY'
