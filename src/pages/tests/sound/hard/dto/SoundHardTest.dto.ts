import type {SoundHardTestQuestionDto} from "./SoundHardTestQuestion.dto.ts";
import type {SoundHardTestAnswerDto} from "./SoundHardTestAnswer.dto.ts";

export type SoundHardTestDto = {
    id: number
    questions: SoundHardTestQuestionDto[],
    answers: SoundHardTestAnswerDto[],
    elapsedTime: number
}