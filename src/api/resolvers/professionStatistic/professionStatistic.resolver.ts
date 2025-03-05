import ApiResolverUtil from "../../../utils/ApiResolver.ts";
import type {CreateProfessionStatsDto} from "./dto/CreateProfessionStats.dto.ts";

export class ProfessionStatisticResolver {
  apiResolver = new ApiResolverUtil('professionStatistic');
  token = localStorage.getItem("token");

  public createStats(data: CreateProfessionStatsDto[]) {
    if (this.token != null) {
      return this.apiResolver.request('createStats', 'POST', data, this.token)
    }
  }
}