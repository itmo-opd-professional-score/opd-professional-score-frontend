export type SoundHardTestSumType = "ODD" | "EVEN"

export type SoundHardTestQuestionDto = {
    id: number
    question: string;
    answer: SoundHardTestSumType;
}

export type SoundHardTestAnswerDto = {
    answer: SoundHardTestSumType;
    questionId: number
    isCorrect: boolean;
    elapsedTime: number
}