import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from '../core/guards/auth.gaurd';
import { TaskAddDialogComponent } from './tasks/option/add-option/add-option';
import { TaskEditDialogComponent } from './tasks/option/edit-option/edit-option';
import { ConfirmationDeleteDialogComponent } from './tasks/option/delete-option/delete-dialog.component';
import { UsersComponent } from './users/users.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.com';
import { UserTaskDetailComponent } from './users/user-detail-task/user-task.com';
import { CreateUserComponent } from './create_user/create_user.com';
import { UserDetailComponent } from './users/user-detail/user-detail.com';
import { ErrorComponent } from './error/error.component';
import { accessAdminGaurd } from '../core/guards/access.gaurd';

export const route: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    title: 'TaskManagement | Login',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'HomePage' },
    canActivate: [authGuard],
    title: 'Home | Tasks',
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        component: TasksComponent,
        data: { shouldReuse: true },
        title: 'Home | Tasks',

        children: [
          { path: 'add', component: TaskAddDialogComponent },
          { path: 'edit', component: TaskEditDialogComponent },
          { path: 'delete', component: ConfirmationDeleteDialogComponent },
        ],
      },
      {
        path: 'tasks/:taskId',
        component: TaskDetailComponent,
        title: 'Home | Tasks | task',

        data: { shouldReuse: true },
      },
      {
        path: 'users',
        canActivate: [accessAdminGaurd],
        data: { shouldReuse: true },
        title: 'Home | Users',

        component: UsersComponent,
      },
      {
        path: 'users/:id/tasks',
        data: { shouldReuse: true },
        canActivate: [accessAdminGaurd],

        component: UserTaskDetailComponent,
        title: 'Home | Users | id | Tasks',
      },
      {
        path: 'users/:id/tasks/:taskId',
        data: { shouldReuse: true },
        canActivate: [accessAdminGaurd],

        component: TaskDetailComponent,
        title: 'Home | Users | id | Tasks | task',
      },
      {
        path: 'createUser',
        title: 'Home | CreateUser',
        canActivate: [accessAdminGaurd],

        component: CreateUserComponent,
      },
    ],
  },
  {
    path: 'users/:id',
    title: 'Profile',

    component: UserDetailComponent,
  },
  {
    path: 'error/:status/:message',
    title: (route: ActivatedRouteSnapshot) => {
      const status = route.paramMap.get('status');
      const message = route.paramMap.get('message');
      return `Error ${status}: ${message}`;
    },

    component: ErrorComponent,
    data: { animation: 'ErrorPage' },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
