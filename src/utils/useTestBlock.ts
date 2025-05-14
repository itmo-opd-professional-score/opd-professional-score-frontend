import { onMounted, ref } from 'vue';
import type { TestBlockJwt, TestBlockTest, TestType } from '../pages/tests/types';
import { jwtDecode } from 'jwt-decode';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserState } from './userState/UserState.ts';
import type { GetTestBlockOutputDto } from '../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import router from '../router/router.ts';
import { TestResolver } from '../api/resolvers/test/test.resolver.ts';
import type { TestDataOutputDto } from '../api/resolvers/test/dto/output/test-data-output.dto.ts';

export const useTestBlock = (blockId: number) => {
  const testBlock = ref<TestBlockJwt | undefined>()

  const loadMatchedTests = async (tests?: TestBlockTest[]) => {
    const matchedTests: {
      id?: number,
      name: TestType,
      setupId?: number,
      available: boolean,
      testTypeId?: number
    }[] = []
    const testResolver = new TestResolver()
    if (tests) {
      for (const test of tests) {
        try {
          const matchedTest: TestDataOutputDto = await testResolver.getByTypeByTestBlockId(test.name, blockId)
          matchedTests.push({ ...test, ...matchedTest })
        } catch (e) {
          matchedTests.push({ ...test})
        }
      }
    }

    return matchedTests
  }

  const loadTestBlock = async () => {
    const userId = UserState.id ? UserState.id : 999999
    if (localStorage.getItem(`guestTestBlock-${blockId}`) !== null) {
      testBlock.value = JSON.parse(localStorage.getItem(`guestTestBlock-${blockId}`)!) as TestBlockJwt;
    } else {
      const testBlocks: GetTestBlockOutputDto[] = await new TestBlockResolver().getAllByUserId(userId)
      const testBlockToken = testBlocks.find(block => block.id === blockId)?.testBlockToken
      testBlock.value = testBlockToken ? jwtDecode(testBlockToken) as TestBlockJwt : undefined
      if (testBlock.value) {
        if (userId == 999999) localStorage.setItem(`guestTestBlock-${blockId}`, JSON.stringify(testBlock.value));
        if (testBlock.value.userId !== userId) await router.push('/profile')
      } else await router.push('/profile')
    }
    return testBlock
  }

  onMounted(async () => {
    await loadTestBlock()
  })

  return {
    loadTestBlock,
    loadMatchedTests,
  }
}