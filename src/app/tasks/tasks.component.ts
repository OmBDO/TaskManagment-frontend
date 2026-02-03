import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskServices } from './tasks.service';
import { TaskComponent } from './task/task.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import { Priority, Task } from './task.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/auth-user.model';
import { UserRole } from '../../core/enums/Role';
@Component({
  selector: 'app-tasks',
  imports: [TaskComponent, TaskHeaderComponent, TaskHeaderComponent, CommonModule],

  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskServices);
  private authService = inject(AuthService);
  currentUser = this.authService.authUser;
  PriorityEnum = Priority;
  RoleEnum = UserRole;
  isDescending = false;
  isGridOn = signal(false);
  ngOnInit(): void {
    if (this.tasks().length === 0) {
      this.taskService.fetchTask();
    }
  }

  tasks = computed(() => this.taskService.paginatedTasks());
  pagination = computed(() => this.taskService.pageMeta());
  onNext() {
    this.taskService.nextPage();
  }
  onPrev() {
    this.taskService.prevPage();
  }
  goToPage(page: number) {
    this.taskService.currentPage.set(page);
  }
  sortByFieldHandler(field: keyof Task) {
    this.taskService.sortByField(field, this.isDescending ? 'desc' : 'asc');
    this.sortDescending();
  }
  sortDescending() {
    this.isDescending = !this.isDescending;
  }

  onGirdOn() {
    this.isGridOn.update((old) => !old);
  }

  isPastDue(dueDate: Date, isComplete: boolean): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isComplete ? false : dueDate < today;
  }
}
