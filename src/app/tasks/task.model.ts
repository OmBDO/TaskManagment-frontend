export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
}
export enum Priority {
  Low = 'Low',
  High = 'High',
  Critical = 'Critical',
  Medium = 'Medium',
}
export interface Task {
  taskId: number;
  title: string;
  dueDate: Date;
  priority: Priority;
  description: string;
  status: TaskStatus;
  isCompleted: boolean;
  userId: string;
}

// id: string;

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

export const mapToTask = (data: any): Task => ({
  taskId: data.taskId,
  title: data.title,
  description: data.description,
  isCompleted: data.isCompleted,
  userId: data.userId,
  dueDate: new Date(data.dueDate),
  status: data.status as TaskStatus,
  priority: data.priority,
});
