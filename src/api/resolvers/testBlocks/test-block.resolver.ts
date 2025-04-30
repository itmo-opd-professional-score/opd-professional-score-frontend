import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { CreateTestBlockInputDto } from './dto/input/create-test-block-input.dto.ts';
import type { GetTestBlockOutputDto } from './dto/output/get-test-block-output.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import type { UpdateTestBlockInputDto } from './dto/input/update-test-block-input.dto.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import type { TestBlockTest } from '../../../pages/tests/types';

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
      DefaultOutputDto<GetTestBlockOutputDto>
    >('create', 'POST', data, this.token ? this.token : undefined);
  }

  public async updateTestBlock(data: UpdateTestBlockInputDto) {
    return await this.apiResolver.request<{
      userId: number,
      testBlockId: number;
      updatedTest: TestBlockTest
    }, DefaultOutputDto<string>>(
      'update',
      'PATCH',
      {
        userId: UserState.id ? UserState.id : 999999,
        ...data
      },
      this.token ? this.token : undefined,
    )
  }
}
