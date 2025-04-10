import ApiResolverUtil from '../../../utils/ApiResolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { TestTypeDataOutputDto } from './dto/output/test-type-data-output.dto.ts';
import type { DefaultErrorDto } from '../../dto/common/default-error.dto.ts';

export class TestTypeResolver {
  private apiResolver = new ApiResolverUtil('testTypes');
  private token = localStorage.getItem('token');
  private usePopUp = usePopupStore();

  public async getAll() {
    return await this.apiResolver
      .request<
        null,
        TestTypeDataOutputDto[]
      >(`getAll`, 'GET', null, this.token ? this.token : undefined)
      .catch((err) => {
        const error = err as DefaultErrorDto;
        this.usePopUp.activateErrorPopup(error.message);
        return null;
      });
  }
}
