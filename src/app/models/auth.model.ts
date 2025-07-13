
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: string;
}
