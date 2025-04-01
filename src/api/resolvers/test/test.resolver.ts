import ApiResolverUtil from "../../../utils/ApiResolver.ts";
import type {CreateSoundAdditionOutputDto} from "./dto/output/create-sound-addition-output.dto.ts";
import type {CreateSoundAdditionInputDto} from "./dto/input/create-sound-addition-input.dto.ts";
import type {UpdateUserIdsOutputDto} from "./dto/output/update-user-ids-output.dto.ts";
import type {DefaultInputDto} from "../../dto/common/default-input.dto";
import {usePopupStore} from "../../../store/popup.store.ts";
import type {TestDataInputDto} from "./dto/input/test-data-input.dto.ts";

export class TestResolver {
    private apiResolver = new ApiResolverUtil('test')
    private token = localStorage.getItem("token");
    private usePopUp = usePopupStore()

    public async getSimpleLightByUserId(userId: number) {
        return await this.apiResolver.request<null, TestDataInputDto[]>(
            `at/getByUserId/${userId}`,
            "GET",
        )
    }

    public async getSimpleSoundByUserId(userId: number) {
        return await this.apiResolver.request<null, TestDataInputDto[]>(
            `at/getByUserId/${userId}`,
            "GET",
        )
    }

    public async getHardLightByUserId(userId: number) {
        return await this.apiResolver.request<null, TestDataInputDto[]>(
            `at/getByUserId/${userId}`,
            "GET",
        )
    }

    public async getAdditionByUserId(userId: number) {
        return await this.apiResolver.request<null, TestDataInputDto[]>(
            `at/getByUserId/${userId}`,
            "GET",
        )
    }


    public async createSoundAddition(data: CreateSoundAdditionOutputDto) {
        return await this.apiResolver.request<CreateSoundAdditionOutputDto, CreateSoundAdditionInputDto>(
            "at/createSoundAddition",
            "POST",
            data,
            this.token ? this.token : undefined,
        )
    }

    public async updateUserIDs(data: UpdateUserIdsOutputDto) {
        return await this.apiResolver.request<UpdateUserIdsOutputDto, DefaultInputDto<string>>(
            "updateUserIDs",
            "PATCH",
            data,
            this.token ? this.token : undefined,
        ).then(res => {
            localStorage.removeItem("completedTestsLinks");
            localStorage.removeItem("completedTestsResults");
            this.usePopUp.activateInfoPopup(res.body)
        }).catch((error) => {
            this.usePopUp.activateErrorPopup(error.message)
        })
    }
}