export interface CreateTestBlockInputDto {
  tests: {
    tests: string[];
  };
  userIDs: number[];
}
