import type { TestBlockTest } from '../../pages/tests/types';

export type LocalTestBlock = {
  testBatteryId: number | null
  tests: TestBlockTest[]
  userIds: number[]
}