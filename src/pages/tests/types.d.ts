import type {
  TestDataOutputAdditionRdoDto
} from '../../api/resolvers/test/dto/output/test-data-output-addition-rdo.dto.ts';
import type {
  TestDataOutputSimpleLightSoundDto
} from '../../api/resolvers/test/dto/output/test-data-output-simple-light-sound.dto.ts';
import type {
  TestDataOutputHardLightDto
} from '../../api/resolvers/test/dto/output/test-data-output-hard-light.dto.ts';
import type { TestDataOutputCognitiveDto } from '../../api/resolvers/test/dto/output/test-data-output-cognitive.dto.ts';
import type {
  TestDataOutputSimpleTrackingDto
} from '../../api/resolvers/test/dto/output/test-data-output-simple-tracking.dto.ts';
import type {
  TestDataOutputHardTrackingDto
} from '../../api/resolvers/test/dto/output/test-data-output-hard-tracking.dto.ts';

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
  id: number;
  tests: TestBlockTest[];
  userId: number;
  iat: number;
  exp: number;
}
export interface TestBatteryJwt {
  tests: TestBlockTest[];
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

export type typeEndpointMap = {
  'at': TestDataOutputAdditionRdoDto,
  'sst': TestDataOutputSimpleLightSoundDto,
  'slt': TestDataOutputSimpleLightSoundDto,
  'hlt': TestDataOutputHardLightDto,
  'rdo': TestDataOutputAdditionRdoDto,
  'cognitive': TestDataOutputCognitiveDto,
  'tracking/simple': TestDataOutputSimpleTrackingDto,
  'tracking/hard': TestDataOutputHardTrackingDto
}