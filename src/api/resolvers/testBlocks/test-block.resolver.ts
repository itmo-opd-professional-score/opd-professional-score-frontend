import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { CreateTestBlockInputDto } from './dto/input/create-test-block-input.dto.ts';
import type { GetTestBlockOutputDto } from './dto/output/get-test-block-output.dto.ts';
import type { DefaultInputDto } from '../../dto/common/default-input.dto.ts';

export class TestBlockResolver {
  private apiResolver = new ApiResolverUtil('testBlock');
  private token = localStorage.getItem('token');

  public async getAll() {
    return await this.apiResolver.request<null, GetTestBlockOutputDto[]>(
      'getAll',
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async getById(id: number) {
    return await this.apiResolver.request<null, GetTestBlockOutputDto>(
      `getById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async getByUserId(id: number) {
    return await this.apiResolver.request<null, GetTestBlockOutputDto[]>(
      `getByUserId/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async createTestBlock(data: CreateTestBlockInputDto) {
    return await this.apiResolver.request<
      CreateTestBlockInputDto,
      DefaultInputDto<GetTestBlockOutputDto>
    >('create', 'POST', data, this.token ? this.token : undefined);
  }
}
