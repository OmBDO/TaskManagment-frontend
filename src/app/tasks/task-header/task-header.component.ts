import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { TaskAddDialogComponent } from '../option/add-option/add-option';
import { Task } from '../task.model';
import { TaskServices } from '../tasks.service';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../../core/enums/Role';
import { FilterComponent } from '../filter/filter.component';

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
  isFilter = false;

  onSortById() {
    this.taskService.sortByField('taskId', this.isDescending ? 'desc' : 'asc');
    this.onDescending();
  }

  onReset() {
    this.taskService.resetfields();
  }

  onDescending() {
    this.isDescending = !this.isDescending;
  }

  onSearchByTitle() {
    const title = this.searchInput.nativeElement.value;
    this.taskService.searchByTitle(title);
  }

  // onToggleGridLines() {
  //   this.isDescending = !this.isDescending;
  // }

  onFilter() {
    this.isFilter = !this.isFilter;
  }

  onFilterClose() {
    this.isFilter = false;
  }

  onAddTask() {
    this.router.navigate(['/home/tasks/add']);
  }

  onOptionOpen() {}
}
