import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date): string | null {
    if (!value) return null;

    const date = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Normalize dates to remove time part for accurate day comparison
    const normDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const normToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const normTomorrow = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
    ).getTime();

    if (normDate === normToday) {
      return 'Today';
    } else if (normDate === normTomorrow) {
      return 'Tomorrow';
    } else {
      // Use Angular's built-in DatePipe for other dates (e.g., "11 July")
      // The format 'dd MMMM' gives the day and full month name.
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'dd MMMM');
    }
  }
}
