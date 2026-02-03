import { UserRole } from '../../core/enums/Role';
import { Task } from '../tasks/task.model';

export type UserRoleManager = `${UserRole.Administrator}` | `${UserRole.User}`;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRoleManager;
}

export interface UserTask extends Task, User {}
