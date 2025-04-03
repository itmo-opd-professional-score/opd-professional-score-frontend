import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { CreateTestBlockOutputDto } from './dto/output/create-test-block-output.dto.ts';
import type { CreateTestBlockInputDto } from './dto/input/create-test-block-input.dto.ts';
import type { DefaultInputDto } from '../../dto/common/default-input.dto.ts';

export class TestBlockResolver {
  private apiResolver = new ApiResolverUtil('testBlock');
  private token = localStorage.getItem('token');

  public async getAll() {
    return await this.apiResolver.request<null, CreateTestBlockInputDto[]>(
      "getAll",
      "GET",
      null,
      this.token ? this.token : undefined
    )
  }

  public async createTestBlock(data: CreateTestBlockOutputDto) {
    return await this.apiResolver.request<
      CreateTestBlockOutputDto,
      DefaultInputDto<CreateTestBlockInputDto>
    >('create', 'POST', data, this.token ? this.token : undefined);
  }
}
