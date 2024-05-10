export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserTokenData {
  userId: string;
  token: string;
}

export interface JWTPayloadData {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
