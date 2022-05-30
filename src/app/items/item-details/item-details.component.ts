import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  extend_status: any[] = ['Open', 'Bid', 'Approval', 'Payment', 'Payment Overdue'];
  close_status: any[] = ['Shipping', 'Transferred'];

  token: any;
  item: any;
  keys: any;
  bids: any[] = [];
  total_bids: any;
  total_bidders: any;
  invoices: any[] = [];
  payfor: any[] = [];
  payment_transaction_types: any[] = [];
  pendings: any[] = [];

  owner: any;
  category: any;
  auction: any;
  winner: any;

  extend_date: any;
  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Item Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        let objects = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : null;
        if (objects) {
          this.item = objects.find(i => i.id === id);
          this.keys = Object.keys(this.item.details);

          this.getBidds(id);
        }
      }
      else { this.router.navigate(['items']); }
    })
  }

  getBidds(id: any) {
    this.utility.loader = true;
    const sub = this.api.get('bids/item/' + id + '/1', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.bids = objects['bids'];

        let bidders = this.bids.filter((bid, i, arr) => arr.findIndex(t => t.user_id === bid.user_id) === i);

        this.total_bids = this.bids.length;
        this.total_bidders = bidders.length;
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getOwner(); });
  }

  getOwner() {
    const sub = this.api.get('owners/' + this.item.owner_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owner = objects['owners'][0];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getCategory(); });
  }

  getCategory() {
    const sub = this.api.get('categories/' + this.item.category_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.category = objects['categories'][0];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getAuction(); });
  }

  getAuction() {
    const sub = this.api.get('auctions/' + this.item.auction_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auction = objects['auctions'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getWinner(); });
  }

  getWinner() {
    const sub = this.api.get('bids/winners/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.winner = objects['winners'][0];

        if (this.winner)
          this.winner.details = JSON.parse(this.winner.details)
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getInvoices(); });
  }

  getInvoices() {
    const sub = this.api.get('invoices/model/item/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['invoices']['invoices'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getPaymentTypes(); });
  }

  getPaymentTypes() {
    const sub = this.api.get('items/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payfors = objects;
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getPendingPayments(); });
  }

  getPendingPayments() {
    const sub = this.api.get('items/offline_payment/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.pendings = objects['payments'];
      },
      async error => {
        alert(error);
      }
    );
    sub.add(() => { this.getTransactionPaymentTypes(); });
    
  }

  getTransactionPaymentTypes() {
    const sub = this.api.get('payments/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payment_transaction_types = objects;
      },
      async error => {
        alert(error);
      }
    );
    sub.add(() => { this.utility.loader = false; });
  }

  saveItem(item: any) {
    localStorage.removeItem('item-edit');
    localStorage.setItem('item-edit', JSON.stringify(item));
  }

  extend(id: any) {
    let body = {
      date: this.extend_date
    }
    this.api.post('items/extendtime/' + id, body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  approve(id: any) {
    this.api.get('items/to_status/approval/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  announce(id: any) {

  }

  reject(id: any) {
    this.api.get('items/to_status/reject/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  close(id: any) {
    this.api.get('items/to_status/closed/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  offline_payment = {
    description: null,
    note: null,
    name: null,
    payfor: null,
    payment_transaction_type: null
  }

  addPayment(id: any) {
    let body = {
      description: this.offline_payment.description,
      note: this.offline_payment.note,
      name: this.offline_payment.name,
      payfor: this.offline_payment.payfor,
      payment_transaction_type: this.offline_payment.payment_transaction_type
    }

    console.log(body);
    this.api.post('items/offline_payment/' + id, body, this.token).subscribe(
      async data => {
        this.getPendingPayments();
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  approvePayment(transaction_id: any) {
    this.api.post('items/offline_payment/approve/' + transaction_id, {}, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  rejectayment(transaction_id: any) {
    this.api.post('items/offline_payment/reject/' + transaction_id, {}, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }
}

