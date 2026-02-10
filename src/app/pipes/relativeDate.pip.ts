import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})

// value | relativeDate
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date): string | null {
    if (!value) return null;

    const date = new Date(value);
    const today = new Date();

    const normDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const normToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const diffTime = normDate - normToday;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(date, 'dd MMMM');

    if (diffDays === 0) {
      return 'Today';
    }

    if (diffDays === 1) {
      return 'Tomorrow';
    }

    if (diffDays < 0) {
      return `${formattedDate} \n(Overdue)`;
    }

    if (diffDays > 1) {
      return `${formattedDate} \n(${diffDays} days left)`;
    }
    return formattedDate;
  }
}
