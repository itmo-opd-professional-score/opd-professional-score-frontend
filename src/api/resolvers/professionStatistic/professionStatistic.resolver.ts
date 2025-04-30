import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { CreateProfessionStatsInputDto } from './dto/input/create-profession-stats-input.dto.ts';
import type { GetOldStatsOutputDto } from './dto/output/get-old-stats-output.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import type { GetProfessionStatisticsOutputDto } from './dto/output/get-profession-statistics-output.dto.ts';

export class ProfessionStatisticResolver {
  private apiResolver = new ApiResolverUtil('professionStatistic');
  private token = localStorage.getItem('token');

  public async getOldStats(data: GetOldStatsOutputDto) {
    return await this.apiResolver.request<
      GetOldStatsOutputDto,
      GetOldStatsOutputDto[]
    >(`getStatsByUserAndProfession/${data.userId}/${data.professionId}`, 'GET');
  }

  public async createStats(data: CreateProfessionStatsInputDto[]) {
    return await this.apiResolver.request<
      CreateProfessionStatsInputDto[],
      DefaultOutputDto<string>
    >('createStats', 'POST', data, this.token ? this.token : undefined);
  }

  public async getProfessionStatistics(id: number) {
    return await this.apiResolver.request<
      number,
      GetProfessionStatisticsOutputDto[]
    >(`getProfessionStatistic/${id}`, 'GET');
  }

  public async updateStats(data: CreateProfessionStatsInputDto[]) {
    return await this.apiResolver.request<
      CreateProfessionStatsInputDto[],
      DefaultOutputDto<string>
    >('updateStats', 'PATCH', data, this.token ? this.token : undefined);
  }
}
