import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { CreateTestBlockOutputDto } from './dto/output/create-test-block-output.dto.ts';
import type { GetTestBlockInputDto } from './dto/input/get-test-block-input.dto.ts';
import type { DefaultInputDto } from '../../dto/common/default-input.dto.ts';

export class TestBlockResolver {
  private apiResolver = new ApiResolverUtil('testBlock');
  private token = localStorage.getItem('token');

  public async getAll() {
    return await this.apiResolver.request<null, GetTestBlockInputDto[]>(
      "getAll",
      "GET",
      null,
      this.token ? this.token : undefined
    )
  }

  public async getByUserId(id: number) {
    return await this.apiResolver.request<null, GetTestBlockInputDto[]>(
      `getByUserId/${id}`,
      "GET",
      null,
      this.token ? this.token : undefined
    )
  }

  public async createTestBlock(data: CreateTestBlockOutputDto) {
    return await this.apiResolver.request<
      CreateTestBlockOutputDto,
      DefaultInputDto<GetTestBlockInputDto>
    >('create', 'POST', data, this.token ? this.token : undefined);
  }
}
