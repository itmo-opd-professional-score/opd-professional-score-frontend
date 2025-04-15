export type TestType =
  | 'SOUND_ADDITION'
  | 'VISUAL_ADDITION'
  | 'SIMPLE_LIGHT'
  | 'SIMPLE_SOUND'
  | 'HARD_LIGHT'
  | 'SIMPLE_RDO'
  | 'HARD_RDO';
export interface TestJwt {
  testId: number | null;
  testType: TestType;
  iat: number;
  exp: number;
}
