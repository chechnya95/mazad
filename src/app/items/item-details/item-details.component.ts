import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'
import { MdEditorOption } from 'ngx-markdown-editor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  extend_status: any[] = ['open', 'bid', 'approval', 'payment', 'payment_overdue'];
  close_status: any[] = ['shipping', 'transferred'];

  token: any;
  item: any;
  keys: any;
  bids: any[] = [];
  total_bids: any;
  total_bidders: any;
  invoices: any[] = [];
  payfors: any[] = [];
  payment_transaction_types: any[] = [];
  pendings: any[] = [];

  owner: any;
  category: any;
  auction: any;
  winner: any;

  extend_date: any;
  errorMessage: boolean = false;
  successMessage: boolean = false;
  Swal = require('sweetalert2')

  public options: MdEditorOption = {
    showBorder: false,
  };

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Item Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getItemDetails(id);
      }
      else { this.router.navigate(['items']); }
    })
  }

  getItemDetails(id: any) {
    this.utility.loader = true;
    const sub = this.api.get(`items/${id}`, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.item = objects['item'];

        this.keys = Object.keys(this.item.details);

        //document.getElementById('terms_ar').innerHTML = this.item.terms.ar;
        //document.getElementById('terms_en').innerHTML = this.item.terms.en;
      },
      async error => { }
    );

    sub.add(() => { this.getBidds(id); });
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
      async error => { }
    );

    sub.add(() => { this.getBiddingDetails(id); });
  }

  getBiddingDetails(id: any) {
    const sub = this.api.get('bids/item/' + id, this.token).subscribe(
      res => {
        let objects = JSON.parse(JSON.stringify(res));

        this.total_bids = objects.bids;
        this.total_bidders = objects.bidders;
      },
      err => { });

    sub.add(() => {
      this.getOwner();
    });
  }

  getOwner() {
    const sub = this.api.get('owners/' + this.item.owner_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owner = objects['owners'][0];
      },
      async error => { }
    );

    sub.add(() => { this.getCategory(); });
  }

  getCategory() {
    const sub = this.api.get('categories/' + this.item.category_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.category = objects['categories'][0];
      },
      async error => { }
    );

    sub.add(() => { this.getAuction(); });
  }

  getAuction() {
    const sub = this.api.get('auctions/' + this.item.auction_id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auction = objects['auctions'];
      },
      async error => { }
    );

    sub.add(() => { this.getWinner(); });
  }

  getWinner() {
    const sub = this.api.get('bids/winners/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.winner = objects['winners']['bids'][0];

        this.winner.details = JSON.parse(JSON.parse(JSON.stringify(this.winner.details)));
      },
      async error => { }
    );

    sub.add(() => { this.getInvoices(); });
  }

  getInvoices() {
    const sub = this.api.get('items/item_payments/item/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['item_payments'];
      },
      async error => { }
    );

    sub.add(() => { this.getPaymentTypes(); });
  }

  getPaymentTypes() {
    const sub = this.api.get('items/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payfors = objects;
      },
      async error => { }
    );

    sub.add(() => { this.getPendingPayments(); });
  }

  getPendingPayments() {
    const sub = this.api.get('items/offline_payment/' + this.item.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.pendings = objects['payments'];
      },
      async error => { }
    );
    sub.add(() => { this.getTransactionPaymentTypes(); });

  }

  getTransactionPaymentTypes() {
    const sub = this.api.get('payments/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payment_transaction_types = objects['payment_type'];
      },
      async error => { }
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

        this.route.queryParams.subscribe(params => {
          let id = params['id'] != null ? params['id'] : null;
          if (id) { this.getItemDetails(id); }
        });
      },
      async error => { this.errorMessage = true; }
    );
  }

  approve(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to approve the selected?' : 'الموافقة على السلعة، هل انت متأكد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.get('items/to_status/payment/' + id, this.token).subscribe(
          async data => {
            this.successMessage = true;

            this.route.queryParams.subscribe(params => {
              let id = params['id'] != null ? params['id'] : null;
              if (id) { this.getItemDetails(id); }
            });
          },
          async error => { this.errorMessage = true; }
        );
      }
    });
  }

  potential_winners: any[] = [];
  announceWinnerModal: Boolean = false;
  announce(id: any) {
    this.api.get('bids/potential_winners/item/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.potential_winners = objects.winners.bids;

        this.announceWinnerModal = true;

      },
      async error => { this.errorMessage = true; }
    );
  }

  announce_winner(item_id: any, bid_id: any) {
    console.log(item_id, bid_id)
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Select the winner, are you sure?' : 'اختيار الفائز، هل انت متأكد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.update(`items/potential_winner/${item_id}/${bid_id}`, {}, this.token).subscribe(
          async data => {
            this.successMessage = true;

            this.route.queryParams.subscribe(params => {
              let id = params['id'] != null ? params['id'] : null;
              if (id) { this.getItemDetails(id); }
            });
          },
          async error => { this.errorMessage = true; }
        );
      }
    });
  }

  reject(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to Reject the selected?' : 'رفض السلعة، هل انت متأكد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.get('items/to_status/reject/' + id, this.token).subscribe(
          async data => {
            this.successMessage = true;

            this.route.queryParams.subscribe(params => {
              let id = params['id'] != null ? params['id'] : null;
              if (id) { this.getItemDetails(id); }
            });
          },
          async error => { this.errorMessage = true; }
        );
      }
    });
  }

  close(id: any) {
    this.api.get('items/to_status/closed/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;

        this.route.queryParams.subscribe(params => {
          let id = params['id'] != null ? params['id'] : null;
          if (id) { this.getItemDetails(id); }
        });
      },
      async error => { this.errorMessage = true; }
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

    this.api.post('items/offline_payment/' + id, body, this.token).subscribe(
      async data => {
        this.getPendingPayments();
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  approvePayment(transaction_id: any) {
    this.api.post('items/offline_payment/approve/' + transaction_id, {}, this.token).subscribe(
      async data => {
        this.getPendingPayments();
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  rejectayment(transaction_id: any) {
    this.api.post('items/offline_payment/reject/' + transaction_id, {}, this.token).subscribe(
      async data => {
        this.getPendingPayments();
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  export(item: any) {
    localStorage.setItem('item_details', JSON.stringify(item));
  }

  export_owner(item: any, bids: any) {
    localStorage.setItem('item_details', JSON.stringify(item));
    localStorage.setItem('item_bids', JSON.stringify(bids));
  }

  disableBids(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Disable all the bids?' : 'تعطيل جميع المزايدات؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.update('bids/disable/item/' + id, {}, this.token).subscribe(
          async data => {
            this.successMessage = true;
          },
          async error => { this.errorMessage = true; }
        );
      }
    });
  }
}