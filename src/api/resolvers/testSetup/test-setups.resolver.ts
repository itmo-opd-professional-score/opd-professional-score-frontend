import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { TestSetupOutputDTO } from './dto/output/test-setup-output.dto.ts';
import type { TestSetupInputDto } from './dto/input/test-setup-input.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import type { TestType } from '../../../pages/tests/types';

export class TestSetupsResolver {
  private apiResolver = new ApiResolverUtil('testSetup');
  private token = localStorage.getItem('token');
  private usePopUp = usePopupStore();

  public async getById(id: number) {
    return await this.apiResolver.request<null, TestSetupOutputDTO>(
      `getById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async getAllByTestType(testType: TestType): Promise<TestSetupOutputDTO[]> {
    return await this.apiResolver.request<null, TestSetupOutputDTO[]>(
      `getAllSetupsByTestType/${testType}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async create(data: TestSetupInputDto): Promise<DefaultOutputDto<TestSetupOutputDTO> | null> {
    return await this.apiResolver.request<TestSetupInputDto, DefaultOutputDto<TestSetupOutputDTO>>(
      'createSetup',
      'POST',
      data,
      this.token ? this.token : undefined,
    ).then((res) => {
      this.usePopUp.activateInfoPopup("Setup was created successfully!")
      return res
    })
  }
}