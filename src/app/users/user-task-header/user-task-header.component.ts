import { Component, ElementRef, inject, output, ViewChild } from '@angular/core';

import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { TaskServices } from '../../tasks/tasks.service';

@Component({
  selector: 'app-user-task-header',
  templateUrl: './user-task-header.component.html',
  styleUrl: './user-task-header.component.css',
  imports: [RouterOutlet],
})
export class UserTaskHeaderComponet {
  private taskService = inject(TaskServices);
  private router = inject(Router);
  @ViewChild('titleInput') searchInput!: ElementRef<HTMLInputElement>;
  onSearch = output<string>();
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
    this.onSearch.emit(title);
  }

  onAddTask() {
    this.router.navigate(['/home/tasks/add']);
  }

  onOptionOpen() {}
}
