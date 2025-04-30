import ApiResolver from '../../../utils/ApiResolver.ts';
import type { LoginUserInputDto } from './dto/input/login-user-input.dto.ts';
import type { DefaultOutputDto } from '../../dto/common/default-output.dto.ts';
import type { RegUserFirstStepInputDto } from './dto/input/reg-user-first-step-input.dto.ts';
import type { AuthUserOutputDto } from './dto/output/auth-user-output.dto.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { DefaultErrorDto } from '../../dto/common/default-error.dto.ts';
import { updateUserState } from '../../../utils/userState/UserState.ts';
import type { SendCodeAgainInputDto } from './dto/input/send-code-again-input.dto.ts';
import type { RegUserSecondStepInputDto } from './dto/input/reg-user-second-step-input.dto.ts';
import router from '../../../router/router.ts';

export class AuthResolver {
  private apiResolver = new ApiResolver('auth');
  private popupStore = usePopupStore();

  public async login(data: LoginUserInputDto) {
    return await this.apiResolver
      .request<LoginUserInputDto, DefaultOutputDto<AuthUserOutputDto>>(
        'login',
        'POST',
        data,
      )
      .then((res) => {
        localStorage.setItem('token', res.body.token);
        updateUserState();
        this.popupStore.activateInfoPopup('Login successfully');
        router.push('/profile');
      })
      .catch((err) => {
        console.log(err)
        const e = err.response.data as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${e.status}. ${e.message}`,
        );
      });
  }

  public async logout() {
    localStorage.removeItem('token');
    updateUserState();
    await router.push('/');
  }

  public async registrationFirstStep(data: RegUserFirstStepInputDto) {
    return await this.apiResolver
      .request<RegUserFirstStepInputDto, DefaultOutputDto<string>>(
        'registrationFirstStep',
        'POST',
        data,
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        const e = err.response.data as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${e.status}. ${e.message}`,
        );

        return false;
      });
  }

  public async registrationSecondStep(data: RegUserSecondStepInputDto) {
    return await this.apiResolver
      .request<RegUserSecondStepInputDto, DefaultOutputDto<AuthUserOutputDto>>(
        'register',
        'POST',
        data,
      )
      .then((res) => {
        localStorage.setItem('token', res.body.token);
        updateUserState();

        this.popupStore.activateInfoPopup('Register successfully');
        router.push('/profile');
      })
      .catch((err) => {
        const e = err.response.data as DefaultErrorDto;
        this.popupStore.activateErrorPopup(
          `Error code: ${e.status}. ${e.message}`,
        );
      });
  }

  public async sendCodeAgain(data: SendCodeAgainInputDto) {
    return await this.apiResolver.request<SendCodeAgainInputDto, null>(
      'sendCodeAgain',
      'POST',
      data,
    );
  }
}
