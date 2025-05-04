import { ref } from 'vue';
import type { TestBlockJwt } from '../pages/tests/types';
import { jwtDecode } from 'jwt-decode';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserState } from './userState/UserState.ts';
import type { GetTestBlockOutputDto } from '../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import router from '../router/router.ts';

export const useTestBlock = async (blockId: number) => {
  const testBlock = ref<TestBlockJwt | undefined>()
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
    }
  }
  return { testBlock }
}