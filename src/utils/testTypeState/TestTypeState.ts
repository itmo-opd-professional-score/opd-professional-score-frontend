import {reactive} from "vue";
import type {TestTypeStateInterface} from "./TestTypeState.types.ts";

export const TestTypeState = reactive<TestTypeStateInterface>({
    types: []
})
