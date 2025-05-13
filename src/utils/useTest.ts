import type { TestSetupOutputDTO } from '../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';
import { TestSetupsResolver } from '../api/resolvers/testSetup/test-setups.resolver.ts';
import { onMounted, ref } from 'vue';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import type { TestBlockJwt, TestType } from '../pages/tests/types';
import { defaultTestSettingsOutput } from '../pages/testSetups/defaultValues.ts';

export interface UseTestOptions {
  testBlockId: string | undefined;
  setupId: string | undefined;
  testType: TestType;
}

export function useTest(options: UseTestOptions) {
  const settings = ref<TestSetupOutputDTO>(defaultTestSettingsOutput);
  const testBlockId = options.testBlockId && !isNaN(parseInt(options.testBlockId)) ?
    parseInt(options.testBlockId) : undefined;
  const setupId = options.setupId && !isNaN(parseInt(options.setupId)) ?
    parseInt(options.setupId) : undefined;

  const updateTestBlockToken = async (): Promise<void>  => {
    if (testBlockId) {
      if (localStorage.getItem(`guestTestBlock-${testBlockId}`)) {
        const testBlock = JSON.parse(localStorage.getItem(`guestTestBlock-${testBlockId}`)!) as TestBlockJwt;
        testBlock.tests.forEach(test => {
          if (test.name === options.testType) test.available = false
        })
        localStorage.setItem(`guestTestBlock-${testBlockId}`, JSON.stringify(testBlock));
      } else {
        await new TestBlockResolver().updateTestBlock({
          testBlockId: testBlockId,
          updatedTest: {
            name: options.testType,
            setupId: setupId,
            available: false
          },
        })
      }
    }
  }

  onMounted(async () => {
    if (setupId && setupId !== -1) new TestSetupsResolver().getById(setupId).then((result => {
      settings.value = result
    }))
  })

  return {
    settings,
    updateTestBlockToken
  }
}