import { ref } from 'vue';
import type { TestBlockJwt } from '../pages/tests/types';
import { jwtDecode } from 'jwt-decode';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserState } from './userState/UserState.ts';
import type { GetTestBlockOutputDto } from '../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import router from '../router/router.ts';

export const useTestBlock = async (blockId: number) => {
  const testBlock = ref<TestBlockJwt | undefined>()

  const testBlocks: GetTestBlockOutputDto[] = await new TestBlockResolver().getAllByUserId(UserState.id!)
  const testBlockToken = testBlocks.find(block => block.id === blockId)?.testBlockToken
  testBlock.value = testBlockToken ? jwtDecode(testBlockToken) as TestBlockJwt : undefined
  if (!testBlock.value || testBlock.value.userId !== UserState.id) await router.push('/profile')

  return {
    testBlock,
  }
}