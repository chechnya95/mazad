import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-payment-transactions',
  templateUrl: './payment-transactions.component.html',
  styleUrls: ['./payment-transactions.component.css']
})
export class PaymentTransactionsComponent implements OnInit {

  token: any;
  transactions: any[] = [];

  transFilter = '';

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Payment Transactions Page';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this.utility.loader = true;
    const sub = this.api.get('payments/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.transactions = objects['payments'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

}
