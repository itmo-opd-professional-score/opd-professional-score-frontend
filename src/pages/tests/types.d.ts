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
  | 'NUMERICAL'
  | 'STROOP'
  | 'VERBAL'
export interface TestJwt {
  testId: number | null;
  testType: TestType;
  iat: number;
  exp: number;
}
export interface TestBlockJwt {
  tests: TestBlockTest[];
  userId: number;
  iat: number;
  exp: number;
}
export interface TestBlockTest {
  name: TestType;
  setupId?: number;
  available: boolean;
}
export type AccelerationMode =
  | 'DISCRETE'
  | 'STEADY'
