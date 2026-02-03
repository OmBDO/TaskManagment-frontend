import { Component, computed, ElementRef, inject, output, ViewChild } from '@angular/core';
import { TaskAddDialogComponent } from '../option/add-option/add-option';
import { Task } from '../task.model';
import { TaskServices } from '../tasks.service';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../../core/enums/Role';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrl: './task-header.component.css',
  imports: [RouterOutlet],
})
export class TaskHeaderComponent {
  private taskService = inject(TaskServices);
  private router = inject(Router);
  private authService = inject(AuthService);
  isGridOne = output();
  RoleEnum = UserRole;
  roles = computed(() => this.authService.authUser()?.roles);
  @ViewChild('titleInput') searchInput!: ElementRef<HTMLInputElement>;
  isDescending = false;
  isOption = false;

  onSortById() {
    this.taskService.sortByField('taskId', this.isDescending ? 'desc' : 'asc');
    this.onDescending();
  }

  onDescending() {
    this.isDescending = !this.isDescending;
  }

  onSearchByTitle() {
    const title = this.searchInput.nativeElement.value;
    this.taskService.searchByTitle(title);
  }

  onToggleGridLines() {
    this.isGridOne.emit();
  }

  onAddTask() {
    this.router.navigate(['/home/tasks/add']);
  }

  onOptionOpen() {}
}
