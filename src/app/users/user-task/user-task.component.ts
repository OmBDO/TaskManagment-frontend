import { Component, computed, ElementRef, HostListener, inject, input } from '@angular/core';
import { RelativeDatePipe } from '../../pipes/relativeDate.pip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskServices } from '../../tasks/tasks.service';
import { Priority, Task, TaskStatus } from '../../tasks/task.model';
import { UserService } from '../user.service';

import { User, UserTask } from '../user.model';
import { Router } from '@angular/router';
@Component({
  selector: '[app-user-task]',
  templateUrl: 'user-task.component.html',
  styleUrl: 'user-task.component.css',
  imports: [RelativeDatePipe, CommonModule, FormsModule],
})
export class UserTaskComponent {
  task = input.required<UserTask>();
  private el = inject(ElementRef);
  private taskService = inject(TaskServices);
  private router = inject(Router);
  private _ = inject(UserService);

  isOption: boolean = false;
  StatusEnum = TaskStatus;
  PriorityEnum = Priority;

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
        // Optional: Handle statuses that don't match
        htmlOutput = '';
        break;
    }
    return htmlOutput;
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
  onUserTaskClick() {
    this.router.navigate(['/home/users', this.task().id, 'tasks']);
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
