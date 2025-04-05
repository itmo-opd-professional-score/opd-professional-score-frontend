import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import type { UpdateUserIdsInputDto } from './dto/input/update-user-ids-input.dto.ts';
import type { DefaultInputDto } from '../../dto/common/default-input.dto';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { TestDataOutputDto } from './dto/output/test-data-output.dto.ts';
import type { CreateAdditionInputDto } from './dto/input/create-addition-input.dto.ts';
import type { CreateSoundAdditionOutputDto } from './dto/output/create-sound-addition-output.dto.ts';

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

  public async getTestsByTypeByUserId(userId: number, typeEndpoint: string) {
    return await this.apiResolver.request<null, TestDataOutputDto[]>(
      `${typeEndpoint}/getByUserId/${userId}`,
      'GET',
      null,
      this.token ? this.token : undefined,
    );
  }

  public async createSoundAddition(data: CreateAdditionInputDto) {
    return await this.apiResolver.request<
      CreateAdditionInputDto,
      CreateSoundAdditionOutputDto
    >(
      'at/createSoundAddition',
      'POST',
      data,
      this.token ? this.token : undefined,
    );
  }

  public async updateUserIDs(data: UpdateUserIdsInputDto) {
    return await this.apiResolver
      .request<UpdateUserIdsInputDto, DefaultInputDto<string>>(
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
}
