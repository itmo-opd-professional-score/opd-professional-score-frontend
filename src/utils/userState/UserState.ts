import { reactive } from 'vue';
import {
  UserRole,
  type UserSex,
  type UserStateInterface,
} from './UserState.types.ts';
import { jwtDecode } from 'jwt-decode';

export const UserState = reactive<UserStateInterface>({
  status: 'unauthorized',
});

interface UserJwt {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  age: string;
  gender: UserSex;
  isBanned: boolean;
  iat: number;
  exp: number;
}

export const updateUserState = () => {
  const token = localStorage.getItem('token');
  const userToVerify = JSON.parse(localStorage.getItem('userToVerify')!);
  if (token) {
    const userData = jwtDecode(token) as UserJwt;

    if (userData) {
      UserState.id = userData.id;
      UserState.status = 'authorized';
      UserState.username = userData.username;
      UserState.email = userData.email;
      UserState.age = userData.age;
      UserState.gender = userData.gender;

      if (userData.role) {
        UserState.role = userData.role;
      } else {
        UserState.role = UserRole.USER;
      }
    }
  } else if (userToVerify) {
    UserState.id = userToVerify.id;
    UserState.status = userToVerify.status;
    UserState.username = userToVerify.username;
    UserState.password = userToVerify.password;
    UserState.email = userToVerify.email;
    UserState.role = userToVerify.role;
  } else {
    UserState.status = 'unauthorized';
  }
};
