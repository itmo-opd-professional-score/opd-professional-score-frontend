import { defineStore } from 'pinia';
import type { TestTypeDataOutputDto } from '../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import { TestTypeResolver } from '../api/resolvers/testType/testType.resolver.ts';
import type { TestDataOutputUnionDto } from '../api/resolvers/test/dto/output/test-data-output-union.dto.ts';

export const useTestTypesStore = defineStore('testTypes', {
  state: () => ({
    types: [] as TestTypeDataOutputDto[],
  }),
  getters: {
    getTestTypes: (state) => {
      return state.types;
    },
  },
  actions: {
    async loadTestTypes() {
      const testTypeResolver = new TestTypeResolver();
      const types = await testTypeResolver.getAll();
      if (types) {
        this.types = types;
      }
    },
    checkTestType(test: TestDataOutputUnionDto): TestTypeDataOutputDto {
      let testType;
      this.types.map((type) => {
        if (test.testTypeId == type.id) {
          testType = type;
        }
      });
      return testType!;
    },
  },
});
