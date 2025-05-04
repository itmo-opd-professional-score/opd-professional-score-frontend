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
    ).catch((error) => { return error.message })
  }

  public async getById(id: number) {
    return await this.apiResolver.request<null, GetTestBlockOutputDto>(
      `getTestBlockById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    ).catch((error) => { return error.message })
  }

  public async getAllByUserId(id: number) {
    return await this.apiResolver.request<null, GetTestBlockOutputDto[]>(
      `getAllAssignedTestBlockByUserId/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    ).catch((error) => { return error.message })
  }

  public async createTestBlock(data: CreateTestBlockInputDto) {
    console.log(data)
    return await this.apiResolver.request<
      CreateTestBlockInputDto,
      DefaultOutputDto<GetTestBlockOutputDto>
    >('createTestBlock', 'POST', data, this.token ? this.token : undefined);
  }

  public async updateTestBlock(data: UpdateTestBlockInputDto) {
    return await this.apiResolver.request<{
      userId: number,
      testBlockId: number;
      updatedTest: TestBlockTest
    }, DefaultOutputDto<string>>(
      'updateTestBlock',
      'PATCH',
      {
        userId: UserState.id ? UserState.id : 999999,
        ...data
      },
      this.token ? this.token : undefined,
    ).catch((error) => { return error.message })
  }
}
