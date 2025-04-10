import ApiResolver from '../../../utils/ApiResolver.ts';
import type { DefaultInputDto } from '../../dto/common/default-input.dto.ts';
import type { ChangePasswordSecondStepInputDto } from './dto/input/change-password-second-step-input.dto.ts';
import type { UserDataOutputDto } from './dto/output/user-data-output.dto.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { DefaultErrorDto } from '../../dto/common/default-error.dto.ts';
import type { UpdateUserInputDto } from './dto/input/update-user-input.dto.ts';
import type { SetUserRoleInputDto } from './dto/input/set-user-role-input.dto.ts';

export class UserResolver {
  private apiResolver = new ApiResolver('user');
  private popupStore = usePopupStore();
  private token = localStorage.getItem('token');

  public async getAll() {
    return await this.apiResolver
      .request<
        null,
        DefaultInputDto<UserDataOutputDto[]>
      >('getAll', 'GET', null, this.token ? this.token : undefined)
      .catch((err) => {
        const error = err as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${error.status}. ${error.message}`,
        );
        return null;
      });
  }

  public async getByEmail(email: string) {
    return await this.apiResolver
      .request<
        null,
        DefaultInputDto<UserDataOutputDto>
      >(`getUserByEmail/${email}`, 'GET', null, this.token ? this.token : undefined)
      .catch((err) => {
        const e = err.response.data as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${e.status}. ${e.message}`,
        );
        return null;
      });
  }

  public async changePasswordFirstStep(email: string) {
    return await this.apiResolver.request<
      { email: string },
      DefaultInputDto<string>
    >(
      'changePasswordFirstStep',
      'POST',
      { email: email },
      this.token ? this.token : undefined,
    );
  }

  public async changePasswordSecondStep(
    data: ChangePasswordSecondStepInputDto,
  ) {
    return await this.apiResolver.request<
      ChangePasswordSecondStepInputDto,
      DefaultInputDto<string>
    >(
      'changePasswordSecondStep',
      'PATCH',
      data,
      this.token ? this.token : undefined,
    );
  }

  public async updateUser(data: UpdateUserInputDto) {
    return await this.apiResolver.request<
      UpdateUserInputDto,
      DefaultInputDto<string>
    >('update', 'PATCH', data, this.token ? this.token : undefined);
  }

  public async setRole(data: SetUserRoleInputDto) {
    return await this.apiResolver
      .request<
        SetUserRoleInputDto,
        DefaultInputDto<string>
      >('setRole', 'PATCH', data, this.token ? this.token : undefined)
      .catch((err) => {
        const e = err.response.data as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${e.status}. ${e.message}`,
        );
        return null;
      });
  }
}
