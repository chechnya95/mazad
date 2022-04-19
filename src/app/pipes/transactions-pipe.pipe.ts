import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionsPipe'
})
export class TransactionsPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.requester.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.reference_id.toLowerCase().indexOf(input.toLowerCase()) >= 0 );
    } else {
      return value;
    }
  }

}
