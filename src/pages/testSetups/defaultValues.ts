import type { TestSetupInputDto } from '../../api/resolvers/testSetup/dto/input/test-setup-input.dto.ts';
import type { TestSetupOutputDTO } from '../../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';

export const defaultTestSettingsOutput: TestSetupOutputDTO  = {
  id: 0,
  testName: '',
  testTypeId: -1,
  showTotalResults: true,
  showProgress: false,
  showTimer: false,
  duration: 10,
  accelerationMode: 'DISCRETE',
  createdAt: '',
  updatedAt: '',
};

export const defaultTestSettingsInput: TestSetupInputDto  = {
  testName: '',
  testTypeId: -1,
  showTotalResults: true,
  showProgress: false,
  showTimer: false,
  duration: 10,
  accelerationMode: 'DISCRETE',
};