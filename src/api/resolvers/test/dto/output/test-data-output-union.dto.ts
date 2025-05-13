import type { TestDataOutputAdditionRdoDto } from './test-data-output-addition-rdo.dto.ts';
import type { TestDataOutputHardLightDto } from './test-data-output-hard-light.dto.ts';
import type { TestDataOutputCognitiveDto } from './test-data-output-cognitive.dto.ts';
import type { TestDataOutputSimpleLightSoundDto } from './test-data-output-simple-light-sound.dto.ts';
import type { TestDataOutputSimpleTrackingDto } from './test-data-output-simple-tracking.dto.ts';
import type { TestDataOutputHardTrackingDto } from './test-data-output-hard-tracking.dto.ts';

export type TestDataOutputUnionDto =
  TestDataOutputAdditionRdoDto |
  TestDataOutputHardLightDto |
  TestDataOutputCognitiveDto |
  TestDataOutputSimpleLightSoundDto |
  TestDataOutputSimpleTrackingDto |
  TestDataOutputHardTrackingDto