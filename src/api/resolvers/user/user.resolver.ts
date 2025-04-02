import ApiResolver from "../../../utils/ApiResolver.ts";
import type {DefaultInputDto} from "../../dto/common/default-input.dto.ts";
import type {ChangePasswordSecondStepOutputDto} from "./dto/output/change-password-second-step-output.dto.ts";
import type {UserDataInputDto} from "./dto/input/user-data-input.dto.ts";
import {usePopupStore} from "../../../store/popup.store.ts";
import type {DefaultErrorDto} from "../../dto/common/default-error.dto.ts";
import type {UpdateUserOutputDto} from "./dto/output/update-user-output.dto.ts";
import type {SetUserRoleOutputDto} from "./dto/output/set-user-role-output.dto.ts";

export class UserResolver {
  private apiResolver = new ApiResolver("user");
  private popupStore = usePopupStore();
  private token = localStorage.getItem("token");

  public async getAll() {
    return await this.apiResolver.request<null, DefaultInputDto<UserDataInputDto[]>>(
        "getAll",
        "GET",
        null,
        this.token ? this.token : undefined,
    ).catch((err)=> {
      const error = err as DefaultErrorDto
      this.popupStore.activateErrorPopup(`Error code: ${error.status}. ${error.message}`);
      return null
    })
  }

  public async getByEmail(email: string) {
    return await this.apiResolver.request<null, DefaultInputDto<UserDataInputDto>>(
        `getUserByEmail/${email}`,
        "GET",
        null,
        this.token ? this.token : undefined,
    ).catch((err) => {
      const e = (err.response.data) as DefaultErrorDto;
      this.popupStore.activateErrorPopup(`Error code: ${e.status}. ${e.message}`);
      return null;
    })
  }

  public async changePasswordFirstStep(email: string) {
    return await this.apiResolver.request<{ email: string }, DefaultInputDto<string>>(
        "changePasswordFirstStep",
        "POST",
        { email: email },
        this.token ? this.token : undefined
    )
  }

  public async changePasswordSecondStep(data: ChangePasswordSecondStepOutputDto) {
    return await this.apiResolver.request<ChangePasswordSecondStepOutputDto, DefaultInputDto<string>>(
      "changePasswordSecondStep",
      "PATCH",
      data,
      this.token ? this.token : undefined,
    )
  }

  public async updateUser(data: UpdateUserOutputDto) {
    return await this.apiResolver.request<UpdateUserOutputDto, DefaultInputDto<string>>(
        "update",
        "PATCH",
        data,
        this.token ? this.token : undefined,
    )
  }

  public async setRole(data: SetUserRoleOutputDto) {
    return await this.apiResolver.request<SetUserRoleOutputDto, DefaultInputDto<string>>(
        "setRole",
        "PATCH",
        data,
        this.token ? this.token : undefined,
    )
  }
}