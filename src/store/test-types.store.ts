import {defineStore} from "pinia";
import type {TestTypeDataInputDto} from "../api/resolvers/testType/dto/input/test-type-data-input.dto.ts";
import {TestTypeResolver} from "../api/resolvers/testType/testType.resolver.ts";
import type {TestDataInputDto} from "../api/resolvers/test/dto/input/test-data-input.dto.ts";

export const useTestTypesStore = defineStore("testTypes", {
  state: () => ({
    types: [] as TestTypeDataInputDto[]
  }),
  getters: {
    getTestTypes: (state) => {
      return state.types;
    }
  },
  actions: {
    async loadTestTypes() {
      const testTypeResolver = new TestTypeResolver();
      const types = await testTypeResolver.getAll();
      if (types) {
        this.types = types;
      }
    },
    checkTestType(test: TestDataInputDto) {
      let typeName;
      this.types.map((type) => {
        if (test.testTypeId == type.id) {
          typeName = type.name;
        }
      });
      return typeName;
    }
  },
})