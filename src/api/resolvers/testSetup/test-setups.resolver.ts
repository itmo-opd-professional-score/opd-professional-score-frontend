import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { TestSetupOutputDTO } from './dto/output/test-setup-output.dto.ts';
import type { DefaultErrorDto } from '../../dto/common/default-error.dto.ts';

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
    ).catch((err) => {
      const error = err as DefaultErrorDto;
      this.usePopUp.activateErrorPopup(error.message);
      return null
    })
  }

}