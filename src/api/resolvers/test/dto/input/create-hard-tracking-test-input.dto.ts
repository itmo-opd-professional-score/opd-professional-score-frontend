export interface CreateHardTrackingTestInputDto {
  userId: number | null;
  duration: number; // длительность теста в секундах
  totalOverlapTime: number; // общее время совпадений
  bestOverlap: number; // лучшее совпадение
  averageOverlap: number; // среднее время совпадений
  overlapCount: number; // количество совпадений
  successRate: number; // успех в процентах
}