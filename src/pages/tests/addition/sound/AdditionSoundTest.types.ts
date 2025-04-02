export type SoundHardTestSumType = 'ODD' | 'EVEN';

export interface SoundHardTestQuestionDto {
  id: number;
  question: string;
  answer: SoundHardTestSumType;
}

export interface SoundHardTestAnswerDto {
  answer: SoundHardTestSumType;
  questionId: number;
  isCorrect: boolean;
  elapsedTime: number;
}
