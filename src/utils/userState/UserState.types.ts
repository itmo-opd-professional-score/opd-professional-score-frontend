export type UserStatus = "unauthorized" | "unverified" | "authorized";
export type UserSex = "MALE" | "FEMALE"

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    EXPERT = "EXPERT",
    MODERATOR = "MODERATOR",
    CONSULTANT = "CONSULTANT",
}

export interface UserStateInterface {
    /**
     * id of User in system
     */
    id?: number;
    /**
     * status of User - on what step of authentication currently is
     */
    status: UserStatus;

    /**
     * Name on website
     */
    username?: string;

    /**
     * User's password
     */
    password?: string;

    /**
     * User's email (and login)
     */
    email?: string;

    /**
     * User's age (for tests)
     */
    birth?: string;

    /**
     * User's sex (for tests)
     */
    sex?: UserSex | undefined;

    /**
     * User's role on website
     */
    role?: UserRole | null;
}