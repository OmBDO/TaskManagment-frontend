export class AppConstant {
  static baseurl = 'https://localhost:7096/api';

  //   auth
  static login = this.baseurl + '/Auth/login';
  static register = this.baseurl + '/Auth/register';

  //   Task
  static getTask = () => this.baseurl + '/Tasks';
  static postTask = () => this.baseurl + '/Tasks';
  static getTaskById = (taskId: number) => this.baseurl + '/Tasks/' + taskId;
  static patchTask = (taskId: number) => this.baseurl + '/Tasks/' + taskId;
  static deleteTask = (taskId: number) => this.baseurl + '/Tasks/' + taskId;

  // User
  static postUser = this.baseurl + '/User';
  static getUsersName = this.baseurl + '/User/names';
  static getUsersDetail = this.baseurl + '/User';
  static getUserDetail = (userId: string) => this.baseurl + '/User/' + userId;
  static getUserTasks = (userId: string) => this.baseurl + '/User/' + userId + '/tasks';
}
