import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemPipe'
})
export class ItemPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.code.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.item_status.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.title.en.toString().indexOf(input.toString()) >= 0 || val.title.ar.toString().indexOf(input) >= 0);
    } else {
      return value;
    }
  }
}
