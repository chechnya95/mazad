import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userPipe'
})
export class UserPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.phone != null && val.phone.toString().indexOf(input) >= 0 || val.email != null && val.email.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.name != null && val.name.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }
}
