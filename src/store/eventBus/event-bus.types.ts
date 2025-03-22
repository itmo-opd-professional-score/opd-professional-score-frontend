export interface LoginEvent {
  email: string;
  password: string;
}

export interface RegisterFirstStepEvent {
  email: string;
  username: string;
}

export interface RegisterSecondStepEvent {
  username: string;
  email: string;
  password: string;
  code: number;
}