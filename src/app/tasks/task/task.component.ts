import { Component, computed, ElementRef, HostListener, inject, input } from '@angular/core';
import { Priority, Task } from '../task.model';
import { RelativeDatePipe } from '../../pipes/relativeDate.pip';
import { TaskOptionComponent } from '../option/option.component';
import { TaskStatus } from '../task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskServices } from '../tasks.service';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../../core/enums/Role';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: '[app-task]',
  templateUrl: 'task.component.html',
  imports: [RelativeDatePipe, TaskOptionComponent, CommonModule, FormsModule],
  styleUrl: 'task.component.css',
})
export class TaskComponent {
  isUserPath = input.required<boolean>();
  task = input.required<Task>();
  isGridOn = input.required<boolean>();
  private el = inject(ElementRef);
  private router = inject(Router);
  private taskService = inject(TaskServices);
  private authService = inject(AuthService);
  roles = computed(() => this.authService.authUser()?.roles ?? []);
  isOption: boolean = false;
  StatusEnum = TaskStatus;
  PriorityEnum = Priority;
  UserEnum = UserRole;

  statusOption = [TaskStatus.Completed, TaskStatus.InProgress, TaskStatus.Pending];
  onStatus(): string {
    const status = this.task().status;
    let htmlOutput = '';

    switch (status) {
      case TaskStatus.Pending:
        htmlOutput = '<img src="../../../assets/image/icons/minus-circle.svg" alt="Pending" />';
        break;

      case TaskStatus.InProgress:
        htmlOutput =
          '<img src="../../../assets/image/icons/check-circle-border.svg" alt="In Progress" />';
        break;

      case TaskStatus.Completed:
        htmlOutput =
          '<img src="../../../assets/image/icons/check-circle-filled.svg" alt="Completed" />';
        break;

      default:
        htmlOutput = '';
        break;
    }
    return htmlOutput;
  }
  onTaskDetailNavigate() {
    this.router.navigate(['/home/tasks', this.task().taskId], {
      queryParams: {
        task: JSON.stringify(this.task()),
      },
    });
  }

  onStatusChange(action: string) {
    if (action in this.StatusEnum) {
      const currentTask = this.task();

      const updatedData = {
        ...currentTask,
        status: this.StatusEnum[action as keyof typeof this.StatusEnum],
        isCompleted: TaskStatus.Completed.toString() == action,
      };
      this.taskService.editTask(currentTask.taskId, updatedData);
    } else {
      console.error(`Invalid status action: ${action}`);
    }
  }

  onOptionClick(): void {
    this.isOption = true;
  }

  onCoseOption() {
    this.isOption = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOption = false;
    }
  }
}
