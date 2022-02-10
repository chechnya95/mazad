import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemPipe'
})
export class ItemPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.code.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.item_status.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }
}
