import type {SoundHardTestSumType} from "./SoundHardTestSumType.types.ts";

export type SoundHardTestAnswerDto = {
    answer: SoundHardTestSumType;
    questionId: number
    isCorrect: boolean;
    elapsedTime: number
}