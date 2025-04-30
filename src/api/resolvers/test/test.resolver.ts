import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { UpdateUserIdsInputDto } from './dto/input/update-user-ids-input.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { TestDataOutputDto } from './dto/output/test-data-output.dto.ts';
import type { CreateAdditionInputDto } from './dto/input/create-addition-input.dto.ts';
import type { CreateOutputDto } from './dto/output/create-output.dto.ts';
import type { CreateSimpleInputDto } from './dto/input/create-simple-input.dto.ts';
import type { CreateRdoInputDto } from './dto/input/create-rdo-input.dto.ts';
import type { TestType } from '../../../pages/tests/types';
import type { CreateHardLightInputDto } from './dto/input/create-hard-light-input.dto.ts';
import type { CreateTrackingInputDto } from './dto/input/create-tracking-input.dto.ts';


export class TestResolver {
  private apiResolver = new ApiResolverUtil('test');
  private token = localStorage.getItem('token');
  private usePopUp = usePopupStore();

  public async getAllByType(typeEndpoint: string) {
    return await this.apiResolver.request<null, TestDataOutputDto[]>(
      `${typeEndpoint}/getAll`,
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async getByTypeById(typeEndpoint: string, id: number) {
    return await this.apiResolver.request<null, TestDataOutputDto>(
      `${typeEndpoint}/getById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async getTestsByTypeByUserId(userId: number, typeEndpoint: string) {
    return await this.apiResolver.request<null, TestDataOutputDto[]>(
      `${typeEndpoint}/getByUserId/${userId}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async createAddition(data: CreateAdditionInputDto, endpoint: string) {
    return await this.apiResolver.request<
      CreateAdditionInputDto,
      CreateOutputDto
    >(
      `at/create${endpoint}Addition`,
      'POST',
      data,
      this.token ? this.token : undefined,
    );
  }

  public async createSimple(data: CreateSimpleInputDto, endpoint: string) {
    return await this.apiResolver.request<
      CreateSimpleInputDto,
      CreateOutputDto
    >(
      `${endpoint}/create`,
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async createHardLight(data: CreateHardLightInputDto) {
    return await this.apiResolver.request<
      CreateSimpleInputDto,
      CreateOutputDto
    >(
      'hlt/create',
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async createRdo(data: CreateRdoInputDto) {
    return await this.apiResolver.request<CreateRdoInputDto, CreateOutputDto>(
      'rdo/createRDOTest',
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async updateUserIDs(data: UpdateUserIdsInputDto) {
    return await this.apiResolver
      .request<UpdateUserIdsInputDto, DefaultOutputDto<string>>(
        'updateUserIDs',
        'PATCH',
        data,
        this.token ? this.token : undefined,
      )
      .then((res) => {
        localStorage.removeItem('completedTestsLinks');
        localStorage.removeItem('completedTestsResults');
        this.usePopUp.activateInfoPopup(res.body);
      })
      .catch((error) => {
        this.usePopUp.activateErrorPopup(error.message);
      });
  }

  public async generateTestLink(testType: {testType: TestType}) {
    return await this.apiResolver.request<{testType: TestType}, string>(
      'getInvitationTestToken',
      'POST',
      testType,
      this.token ? this.token : undefined,
    ).catch((err) => {
      this.usePopUp.activateErrorPopup(err.message);
      return null
    })
  }

  public async createTracking(data: CreateTrackingInputDto) {
    return await this.apiResolver.request<
      CreateTrackingInputDto,
      CreateOutputDto
    >(
      'tracking/create',
      'POST',
      data,
      this.token ? this.token : undefined,
    ).catch((error) => {
      this.usePopUp.activateErrorPopup(error.message);
    });
  }
}
