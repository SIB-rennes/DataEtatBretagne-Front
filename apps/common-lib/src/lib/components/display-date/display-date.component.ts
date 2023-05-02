import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-display-date',
  standalone: true,
  imports: [CommonModule],
  template: '{{ formattedDate }}',
})
export class DisplayDateComponent {
  private datePipe = inject(DatePipe);
  @Input() date!: string | Date; // Input pour la date au format UTC
  @Input() dateFormat: string = 'dd/MM/yyyy à HH:mm';

  get formattedDate(): string {
    if (this.date) {
      const utcDate = new Date(this.date);
      utcDate.setUTCMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
      return this.datePipe.transform(utcDate, this.dateFormat) || '';
    }
    return '';
  }
}
