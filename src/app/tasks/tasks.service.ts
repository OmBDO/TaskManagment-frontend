import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';

import { mapToTask, Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../../core/constant/app_constants';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Define the interface based on your API response
export interface TaskResponse {
  data: Task[];
  metaData: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    totalRecord: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class TaskServices {
  private tasks = signal<Task[]>([]);
  private serverMeta = signal<TaskResponse['metaData'] | null>(null);

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private pageSize = 8;

  currentPage = signal<number>(1);
  searchQuery = signal<string>('');

  private fetchTaskAsync = (
    pageNumber = 1,
    isComplete?: boolean,
    search?: string,
    field?: keyof Task,
    sortDescending?: boolean,
  ) => {
    const subscription = this.httpClient
      .get<TaskResponse>(AppConstant.getTask(), {
        params: {
          pageSize: this.pageSize.toString(),
          pageNumber: pageNumber.toString(),
          ...(isComplete !== undefined && { isComplete: isComplete.toString() }),
          ...(search && { search: search.trim() }),
          ...(field && { sortBy: field as string }),
          ...(sortDescending !== undefined && { sortDescending: sortDescending.toString() }),
        },
      })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((item) => mapToTask(item)),
        })),
      )
      .subscribe((res) => {
        console.log(res.data);
        this.tasks.set(res.data);
        this.serverMeta.set(res.metaData);
        this.currentPage.set(res.metaData.currentPage);
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  };

  private getTaskByIdAsync(taskId: number) {
    return this.httpClient
      .get<Task>(AppConstant.getTaskById(taskId))
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  private addTaskAsync(task: Task) {
    const dateObj = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    const { taskId, ...rest } = task;
    const payload = {
      ...rest,
      dueDate: dateObj.toISOString().split('T')[0],
    };
    console.log(payload);
    const subscription = this.httpClient
      .post<TaskResponse>(AppConstant.postTask(), payload)
      .subscribe({
        next: () => {
          this.fetchTaskAsync(1);
        },
        error: (err) => console.error('Add failed', err),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private editTaskAsync(taskIdV: number, task: Task) {
    const dateObj = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    const { taskId, ...rest } = task;
    const payload = {
      ...rest,
      dueDate: dateObj.toISOString().split('T')[0],
    };

    const subscription = this.httpClient
      .patch<TaskResponse>(`${AppConstant.patchTask(taskIdV)}`, payload)
      .subscribe({
        next: () => {
          this.fetchTaskAsync(this.currentPage());
        },
        error: (err) => console.error('Update failed', err),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private deleteTaskAsync(id: number) {
    const subscription = this.httpClient.delete(`${AppConstant.deleteTask(id)}`).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.taskId !== id));

        if (this.tasks().length === 0 && this.currentPage() > 1) {
          this.fetchTaskAsync(this.currentPage() - 1);
        } else {
          this.fetchTaskAsync(this.currentPage());
        }
      },
      error: (err) => console.error('Delete failed', err),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  paginatedTasks = computed(() => this.tasks());

  pageMeta = computed(() => {
    const meta = this.serverMeta();
    if (!meta) {
      return { totalItems: 0, totalPages: 1, currentPage: 1, isNext: false, isPrevious: false };
    }
    return {
      totalItems: meta.totalRecord,
      totalPages: meta.totalPages,
      currentPage: meta.currentPage,
      isNext: meta.hasNext,
      isPrevious: meta.hasPrevious,
    };
  });

  fetchTask() {
    this.fetchTaskAsync();
  }
  addTask(task: Task) {
    this.addTaskAsync(task);
  }

  editTask(taskId: number, task: Task) {
    this.editTaskAsync(taskId, task);
  }

  deleteTask(taskId: number) {
    this.deleteTaskAsync(taskId);
  }

  getTaskDetail(taskId: number) {
    return this.getTaskByIdAsync(taskId);
  }

  nextPage() {
    if (this.pageMeta().isNext) {
      this.fetchTaskAsync(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.pageMeta().isPrevious) {
      this.fetchTaskAsync(this.currentPage() - 1);
    }
  }

  searchByTitle(title: string) {
    this.searchQuery.set(title);

    this.fetchTaskAsync(1, undefined, title);
  }

  sortByField(field: keyof Task, direction: 'asc' | 'desc' = 'asc') {
    const isDescending = direction === 'desc';

    this.fetchTaskAsync(1, undefined, this.searchQuery(), field, isDescending);
  }

  removeLogoutTask() {
    this.tasks.set([]);
  }
}
