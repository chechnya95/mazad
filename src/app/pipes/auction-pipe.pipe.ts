import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'auctionPipe'
})
export class AuctionPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val.title.en.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.auction_type.toLowerCase().indexOf(input.toLowerCase()) >= 0 || val.code.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }
}
