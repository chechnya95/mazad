import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br'
})
export class Nl2brPipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (typeof value === 'undefined' || value === null) {
      return value;
    } else {
      //console.log(value.replace(/[\r\n]/gm, '<br/>'));
      return value.replace(/\\n/g, '<br/>');
    }
  }

}
