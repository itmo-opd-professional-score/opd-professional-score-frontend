import type { TestDataOutputSimpleLightSoundDto } from './test-data-output-simple-light-sound.dto.ts';

export interface TestDataOutputHardLightDto extends TestDataOutputSimpleLightSoundDto {
  mistakes: number
}