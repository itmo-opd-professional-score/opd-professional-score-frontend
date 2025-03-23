import type {UserSex} from "../../../../../utils/userState/UserState.types.ts";


export interface UpdateUserOutputDto {
    id?: number,
    updatedData?: {
        username?: string | undefined,
        birth?: string | undefined
        sex?: UserSex | undefined,
    }
}