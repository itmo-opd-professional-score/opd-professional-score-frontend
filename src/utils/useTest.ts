import type { TestSetupOutputDTO } from '../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';
import { TestSetupsResolver } from '../api/resolvers/testSetup/test-setups.resolver.ts';
import { onMounted, ref } from 'vue';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import type { TestType } from '../pages/tests/types';
import router from '../router/router.ts';

export interface UseTestOptions {
  testBlockId: string | undefined;
  setupId: string | undefined;
  testType: TestType;
}

export function useTest(options: UseTestOptions) {
  const settings = ref<TestSetupOutputDTO | undefined>();
  const testBlockId = options.testBlockId && !isNaN(parseInt(options.testBlockId)) ?
    parseInt(options.testBlockId) : undefined;
  const setupId = options.setupId && !isNaN(parseInt(options.setupId)) ?
    parseInt(options.setupId) : undefined;

  const updateTestBlockToken = async (): Promise<void>  => {
    if (testBlockId) {
      const newToken = (await new TestBlockResolver().updateTestBlock({
        testBlockId: testBlockId,
        updatedTest: {
          name: options.testType,
          setupId: setupId,
          available: false
        },
      })).body
      if (newToken) {
        localStorage.setItem('currentTestBlock', newToken);
        await router.push(`/testBlock/${testBlockId}/${newToken}`)
        return
      }
    } router.go(0)
  }

  onMounted(async () => {
    if (setupId) new TestSetupsResolver().getById(setupId).then((result => {
      settings.value = result
    })).catch(() => {settings.value = undefined})
    if (!settings.value)  settings.value = {
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
    }
  })

  return {
    settings,
    updateTestBlockToken
  }
}