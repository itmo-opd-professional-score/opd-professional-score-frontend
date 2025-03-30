import ApiResolverUtil from "../../../utils/ApiResolver.ts";
import type {CreateSoundAdditionOutputDto} from "./dto/output/create-sound-addition-output.dto.ts";
import type {CreateSoundAdditionInputDto} from "./dto/input/create-sound-addition-input.dto.ts";
import type {UpdateUserIdsOutputDto} from "./dto/output/update-user-ids-output.dto.ts";
import type {DefaultInputDto} from "../../dto/common/default-input.dto";

export class TestResolver {
    private apiResolver = new ApiResolverUtil('test')
    private token = localStorage.getItem("token");

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
        )
    }
}