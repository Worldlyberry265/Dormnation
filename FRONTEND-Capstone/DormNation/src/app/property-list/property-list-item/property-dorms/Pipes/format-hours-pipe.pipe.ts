import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHours'
})
export class FormatHoursPipePipe implements PipeTransform {

  transform(hours: number): string {
    if (hours === 0) {
      return '00:00';
    } else if (hours < 12) {
      return hours + ':00 am';
    } else if (hours === 12) {
      return '12:00 pm';
    } else {
      return (hours - 12) + ':00 pm';
    }
  }

}

