import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  token: any;
  user: any;
  bids: any[] = [];
  wallets: any[] = [];
  deposits: any[] = [];
  payment_transaction_types: any[] = [];

  errorMessage: boolean = false;
  successMessage: boolean = false;
  userBlocked: boolean = false;

  wallet_id: any;
  block_id: any;
  note: any;

  image: any;
  new_password: any;
  currentLanguage: any;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router,
    public translate: TranslateService) {
    this.currentLanguage = this.translate.currentLang;
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'User Details';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.checkUserBlock(id);

        let objects = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null;
        if (objects) {
          this.user = objects.find(i => i.id === id);
          this.user.details = this.user.user_details ? JSON.parse(this.user.user_details) : '';
        }
      }
      else { this.router.navigate(['users']); }
    })
  }

  checkUserBlock(id) {
    const sub = this.api.get('blacklists/user/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        let blocked = objects['blacklists']['blacklists']

        if (blocked.length > 0) { this.userBlocked = true; this.block_id = blocked[0].id; }
      },
      async error => { }
    );

    sub.add(() => { this.getUserWiningAuctions(this.user.id); });
  }

  blockUser(id: any) {
    let body = {
      user_id: id
    }
    this.api.post('blacklists/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  unblock(id: any) {
    this.api.delete('blacklists/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { this.errorMessage = true; }
    );
  }

  getUserWiningAuctions(id: any) {
    const sub = this.api.get('bids/winners/user/' + id, this.token).subscribe(
      res => {
        let object = JSON.parse(JSON.stringify(res));
        this.bids = object.winners.bids;

        this.bids = this.bids.filter(i => i.user_id === id);
      },
      err => {

      }
    );

    sub.add(() => { this.getUserWallet(id); });
  }

  getUserWallet(id: any) {
    const sub = this.api.get('wallets/user/' + id, this.token).subscribe(
      res => {
        let object = JSON.parse(JSON.stringify(res));
        this.wallets = object['wallets']['wallets'];

        this.wallets = this.wallets.filter(i => i.user.id === id);
      },
      err => {

      }
    );

    sub.add(() => { this.getUserDeposits(id); });
  }

  getUserDeposits(id: any) {
    const sub = this.api.get('deposits/user/' + id, this.token).subscribe(
      res => {
        let objects = JSON.parse(JSON.stringify(res));
        this.deposits = objects['deposits']['deposits'];

        this.deposits = this.deposits.filter(i => i.user.id === id);
      },
      err => {

      }
    );

    sub.add(() => { this.getTransactionPaymentTypes(); });
  }

  requestRefund(id: any) {
    this.api.post('wallets/' + id + '/refund', {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }

  insuranceConfiscation(id: any) {
    const sub = this.api.update('deposits/confiscate/' + id, {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }

  withdraw(id: any) {
    const sub = this.api.update('deposits/withdraw/' + id, {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }

  itemId(id: any, note: any) {
    this.wallet_id = id;
    this.note = note;
  }

  adddNote(id: any) {
    const sub = this.api.update('wallets/' + id + '/note', { note: this.note }, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }

  getTransactionPaymentTypes() {
    const sub = this.api.get('payments/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payment_transaction_types = objects['payment_type'];
      },
      async error => {

      }
    );
    sub.add(() => { });
  }

  async offline_wallet(id: any) {
    let _options = '';
    this.payment_transaction_types.forEach((item) => {
      _options += `<option value="${item}">${item}</option>`
    });

    const { value: formValues } = await Swal.fire({
      title: 'Please provide wallet details: ',
      html:
        '<input id="swal-input1" class="swal2-input" type="text" placeholder="Amount">' +
        '<input id="swal-input2" class="swal2-input" type="text" placeholder="VAT">' +
        '<input id="swal-input3" class="swal2-input" type="text" placeholder="Fee">' +
        '<label for="swal-input4">Choose payment type:</label>' +
        '<select id="swal-input4" class="swal2-input" name="cars">' +
        _options +
        '</select>',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value,
          (document.getElementById('swal-input4') as HTMLInputElement).value,
        ]
      }
    });

    let amount = +formValues[0];
    let vat = formValues[1] ? +formValues[1] : 0;
    let fee = formValues[2] ? +formValues[2] : 0;
    let payment_type = formValues[3];

    if (amount && amount > 0) {
      let body = {
        amount: amount,
        user_id: id,
        vat: vat,
        payment_type: payment_type,
        fee: fee
      }

      this.api.post("wallets/offline_payment", body, this.token).subscribe(
        async data => {
          Swal.fire({
            title: 'تم اضافة مبلغ الايداع',
            text: 'Amount wallet successfully.'
          });
        },
        async error => {
          Swal.fire({
            title: 'Error...',
            text: 'ERROR: cannot connect!\nPlease try again later.'
          });
        }
      );
    }
  }

  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.image = fileList[0];
  }

  addIdImage(id: any) {
    let formData: FormData = new FormData();

    if (this.image) {
      formData.append('id_card_image', this.image, this.image.name);
      this.api.post_form(`users/image/${id}`, formData, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Error...',
            text: 'ERROR: cannot connect!\nPlease try again later.'
          });
        }
      );
    }
  }

  updatePassword(user_id: any) {

  }
}
