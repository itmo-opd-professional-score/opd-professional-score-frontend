import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { FullPvkStructureOutputDto } from './dto/output/full-pvk-structure-output.dto.ts';

export class PvkResolver {
  private apiResolver = new ApiResolverUtil('profChar');

  public async getAll() {
    return await this.apiResolver.request<null, FullPvkStructureOutputDto[]>(
      'getAll',
      'GET',
    );
  }

  public async getByName(name: string) {
    return await this.apiResolver.request<null, FullPvkStructureOutputDto>(
      `getByName/${name}`,
      'GET',
    );
  }

  public async getProfCharById(id: number) {
    return await this.apiResolver.request<number, FullPvkStructureOutputDto>(
      `getProfCharById/${id}`,
      'GET',
    );
  }
}
