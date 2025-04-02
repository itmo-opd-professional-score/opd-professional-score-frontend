import { reactive } from 'vue';
import { TestTypeResolver } from '../../api/testType/testType.resolver.ts';
import type { TestTypeStateInterface } from './TestTypeState.types.ts';
import type { TestDataInputDto } from '../../api/resolvers/test/dto/input/test-data-input.dto.ts';

export const TestTypeState = reactive<TestTypeStateInterface>({
  types: [],
});

export const loadTestTypes = async () => {
  const testTypeResolver = new TestTypeResolver();
  const types = await testTypeResolver.getAll();
  if (types) {
    TestTypeState.types = types;
  }
};

export const checkTestType = (test: TestDataInputDto) => {
  let typeName;
  TestTypeState.types.map((type) => {
    if (test.testTypeId == type.id) {
      typeName = type.name;
    }
  });
  return typeName;
};
