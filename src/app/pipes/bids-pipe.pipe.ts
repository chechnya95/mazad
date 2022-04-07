import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bidsPipe'
})
export class BidsPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.user.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.user.phone != null && val.user.phone.toString().indexOf(input) >= 0 || val.item.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.item.title.en.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}
