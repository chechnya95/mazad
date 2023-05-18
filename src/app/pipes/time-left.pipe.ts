import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeLeft'
})
export class TimeLeftPipe implements PipeTransform {

  transform(endTime: string | Date): string {
    if (endTime) {
      const currentDate = new Date();
      const endDate = endTime instanceof Date ? endTime : new Date(endTime);

      let delta = Math.abs(endDate.getTime() - currentDate.getTime()) / 1000;

      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      const seconds = Math.floor(delta % 60); 

      let result = '';
      if (days > 0) result += `${days} day(s), `;
      if (result || hours > 0) result += `${hours} hour(s), `;
      if (result || minutes > 0) result += `${minutes} minute(s), `;
      result += `${seconds} second(s) left`;

      //return `${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s) left`;
      return result;
  }
  return (endTime ?? '').toString();
  }
}
