export interface User {
  id: number;
  username: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: number;
  title: string;
  description: string;
}
