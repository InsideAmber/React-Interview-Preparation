export interface User {
  id: number;
  name: string;
}

export interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
}