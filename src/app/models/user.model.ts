
export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: Role;
}

export interface UserRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: Role;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
