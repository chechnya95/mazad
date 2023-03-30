import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'walletPipe'
})
export class WalletPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.user_id != null && val.user_id.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.transaction_id != null && val.transaction_id.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}
