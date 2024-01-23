import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import * as e from 'cors';

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
  invoices: any[] = [];
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
      let isUserExsist = false;
      if (id) {
        let objects = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null;
        if (objects) {
          this.user = objects.find(i => i.id === id);
          if (this.user) {
            this.user.details = this.user.user_details ? UtilitiesService.parseIfNotJsonObject(this.user.user_details) : '';
            isUserExsist = true;
          }
        }
        if (!isUserExsist) {
          this.getUser(id);
          console.log(this.user);
        } else {
          this.checkUserBlock(id);
        }
      }
      else { this.router.navigate(['users']); }

    })
  }
  getUser(id: any) {
    const sub = this.api.get('users/' + id, this.token).subscribe(
      async data => {
        let object = JSON.parse(JSON.stringify(data));
        this.user = object['users'];
        this.user.details = this.user.user_details ? UtilitiesService.parseIfNotJsonObject(this.user.user_details) : '';
      },
      async error => { }
    );
    sub.add(() => { this.checkUserBlock(id); });
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

    sub.add(() => { this.getUserWiningAuctions(id); });
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

  loginas(id: any) {
    this.api.post('users/admin/loginas/' + id, {} ,this.token).subscribe(
      async data => {
        //let object = JSON.parse(JSON.stringify(data));
        this.redirectToPublicInterface(JSON.stringify(data));
        //this.api.setToken(object);
        //let token = object['token'];
        //localStorage.setItem('access_token', token);
        //this.router.navigate(['dashboard']);
      },
      async error => { }
    );
  }
  
  redirectToPublicInterface(data: string) {
    // Redirect to the public interface with the token
    window.location.href = `https://mazad.om/login?token=${data}`;
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
      err => { }
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
      err => { }
    );

    sub.add(() => { this.getTransactionPaymentTypes(id); });
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

  getTransactionPaymentTypes(id: any) {
    const sub = this.api.get('payments/payment_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.payment_transaction_types = objects['payment_type'];
      },
      async error => {

      }
    );
    sub.add(() => { this.getInvoices(id); });
  }

  getInvoices(id: any) {
    const sub = this.api.get('invoices/user/' + id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.invoices = objects['invoices']['invoices'];
      },
      async error => { }
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
    let body = {
      password: this.new_password
    }

    this.api.post(`users/${user_id}/password`, body, this.token).subscribe(
      async date => {
        Swal.fire(
          'Success',
          'Password changed successfully!',
          'success'
        )
      },
      error => {
        console.log(error)
        Swal.fire({
          title: 'حدث خطأ اثناء الارسال',
          text: `${error.status}: Could not send your request!`
        });
      }
    );
  }

  saveInvoice(invoice: any) {
    localStorage.removeItem('invoice');
    localStorage.setItem('invoice', JSON.stringify(invoice));
  }

  update_wallet(id: any) {
    this.api.update_form('users/' + id + '/update_wallet', {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );
  }
}
