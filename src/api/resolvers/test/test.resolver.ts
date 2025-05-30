import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { UpdateUserIdsInputDto } from './dto/input/update-user-ids-input.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import type { CreateAdditionInputDto } from './dto/input/create-addition-input.dto.ts';
import type { CreateOutputDto } from './dto/output/create-output.dto.ts';
import type { CreateSimpleInputDto } from './dto/input/create-simple-input.dto.ts';
import type { CreateRdoInputDto } from './dto/input/create-rdo-input.dto.ts';
import type { TestType, typeEndpointMap } from '../../../pages/tests/types';
import type { CreateHardLightInputDto } from './dto/input/create-hard-light-input.dto.ts';
import type { CreateSimpleTrackingInputDto } from './dto/input/create-simple-tracking-input.dto.ts';
import type { CreateCognitiveInputDto } from './dto/input/create-cognitive-input.dto.ts';
import type { CreateHardTrackingInputDto } from './dto/input/create-hard-tracking-input.dto.ts';


export class TestResolver {
  private apiResolver = new ApiResolverUtil('test');
  private token = localStorage.getItem('token');

  public async getAllByType<T extends keyof typeEndpointMap>(typeEndpoint: string) {
    return await this.apiResolver.request<null, typeEndpointMap[T][]>(
      `${typeEndpoint}/getAll`,
      'GET',
      null,
      this.token ? this.token : undefined,
    ).catch((error) => {
      console.error(error.message)
      return []
    })
  }

  public async getByTypeById<T>(typeEndpoint: string, id: number) {
    return await this.apiResolver.request<null, T>(
      `${typeEndpoint}/getById/${id}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async getTestsByTypeByUserId<T>(userId: number, typeEndpoint: string) {
    return await this.apiResolver.request<null, T[]>(
      `${typeEndpoint}/getByUserId/${userId}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
  }

  public async getByTypeByTestBlockId<T>(typeEndpoint: string, testBlockId: number) {
    return await this.apiResolver.request<null, T>(
      `${typeEndpoint}/getByTestBlockId/${testBlockId}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    )
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
    )
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

  public async createCognitive(data: CreateCognitiveInputDto) {
    return await this.apiResolver.request<CreateCognitiveInputDto, CreateOutputDto>(
      'cognitive/create',
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
      .then(() => {
        localStorage.removeItem('completedTestsLinks');
        localStorage.removeItem('completedTestsResults');
      })
  }

  public async generateTestLink(testType: {testType: TestType}) {
    return await this.apiResolver.request<{testType: TestType}, string>(
      'getInvitationTestToken',
      'POST',
      testType,
      this.token ? this.token : undefined,
    )
  }

  public async createSimpleTracking(data: CreateSimpleTrackingInputDto) {
    return await this.apiResolver.request<
      CreateSimpleTrackingInputDto,
      CreateOutputDto
    >(
      'tracking/simple/create',
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }

  public async createHardTracking(data: CreateHardTrackingInputDto) {
    return await this.apiResolver.request<
      CreateHardTrackingInputDto,
      CreateOutputDto
    >(
      'tracking/hard/create',
      'POST',
      data,
      this.token ? this.token : undefined,
    )
  }
}
