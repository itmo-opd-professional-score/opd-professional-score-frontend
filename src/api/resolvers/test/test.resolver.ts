import ApiResolverUtil from "../../../utils/ApiResolver.ts";
import type {DefaultInputDto} from "../../dto/common/default-input.dto.ts";
import type {CreateSoundAdditionOutput} from "./dto/output/create-sound-addition-output.dto.ts";

export class TestResolver {
    private apiResolver = new ApiResolverUtil('test')
    private token = localStorage.getItem("token");

    public async createSoundAddition(data: CreateSoundAdditionOutput) {
        return await this.apiResolver.request<CreateSoundAdditionOutput, DefaultInputDto<string>>(
            "at/createSoundAddition",
            "POST",
            data,
            this.token ? this.token : undefined,
        )
    }
}