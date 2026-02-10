import { Component, ElementRef, HostListener, inject, output } from '@angular/core';
import { TaskStatus } from '../task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-filter-popup',
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  StatusEnum = TaskStatus;
  private el = inject(ElementRef);
  onClose = output();
  taskModel = {
    dueDate: '',
    priority: 'medium',
    status: this.StatusEnum.Pending,
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.el.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.onClose.emit();
    }
  }
  minDate: string = new Date().toISOString().split('T')[0];

  statuses = [this.StatusEnum.Completed, this.StatusEnum.InProgress, this.StatusEnum.Pending];

  onSumbit() {}
}

export interface FilterModel {
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: TaskStatus;
}
