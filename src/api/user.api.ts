import axios from "axios";
import { type User } from "../types/user" // or from slice if not shared

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
  return response.data;
};