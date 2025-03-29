import ApiResolverUtil from "../../../utils/ApiResolver.ts";
import type {CreateSoundAdditionOutputDto} from "./dto/output/create-sound-addition-output.dto.ts";
import type {CreateSoundAdditionInputDto} from "./dto/input/create-sound-addition-input.dto.ts";

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
}