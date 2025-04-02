import type {UserRole} from "../../../../../utils/userState/UserState.types.ts";

export interface SetUserRoleOutputDto {
    id: number,
    role: UserRole
}