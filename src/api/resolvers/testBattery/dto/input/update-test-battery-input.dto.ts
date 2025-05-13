import type { CreateTestBatteryInputDto } from './create-test-battery-input.dto.ts';

export interface UpdateTestBatteryInputDto {
  testBatteryId: number;
  updatedData: CreateTestBatteryInputDto
}
