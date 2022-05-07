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
    this.utility.loader = true;
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

    sub.add(() => { this.utility.loader = false; });
  }

  getInvoices() {
    this.api.get('invoices/item/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['invoices']['invoices'];
      },
      async error => {
        alert(error);
      }
    );
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

  addPayment(id: any) {

  }
}

