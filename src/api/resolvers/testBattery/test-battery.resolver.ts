import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { TestBatteryOutputDto } from './dto/output/test-battery-output.dto.ts';
import type { CreateTestBatteryInputDto } from './dto/input/create-test-battery-input.dto.ts';
import type { UpdateTestBatteryInputDto } from './dto/input/update-test-battery-input.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';

export class TestBatteryResolver {
  private apiResolver = new ApiResolverUtil('testBattery');
  private token = localStorage.getItem('token');

  public async getAll() {
    return await this.apiResolver.request<null, TestBatteryOutputDto[]>(
      'getAll',
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async getById(id: number) {
    return await this.apiResolver.request<null, TestBatteryOutputDto>(
      `getById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    ).catch((_) => { return null })
  }

  public async create(data: CreateTestBatteryInputDto) {
    console.log(data)
    return await this.apiResolver.request<CreateTestBatteryInputDto, DefaultOutputDto<TestBatteryOutputDto>>(
      'create',
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async updateById(data: UpdateTestBatteryInputDto) {
    return await this.apiResolver.request<UpdateTestBatteryInputDto, TestBatteryOutputDto>(
      `update`,
      'PATCH',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async deleteById(id: number) {
    return await this.apiResolver.request<null, TestBatteryOutputDto>(
      `delete/${id}`,
      'DELETE',
      null,
      this.token ? this.token : undefined,
    )
  }
}