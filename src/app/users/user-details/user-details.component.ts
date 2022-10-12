import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  token: any;
  user: any;
  bids: any[] = [];
  deposits: any[] = [];
  wallets: any[] = [];

  errorMessage: boolean = false;
  successMessage: boolean = false;
  userBlocked: boolean = false;

  deposit_id: any;
  block_id: any;
  note: any;

  constructor(public utility: UtilitiesService, public api: ApiService, private route: ActivatedRoute, private router: Router) {
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
      async error => { console.log(error); }
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
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  unblock(id: any) {
    this.api.delete('blacklists/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  getUserWiningAuctions(id: any) {
    const sub = this.api.get('bids/winners', this.token).subscribe(
      res => {
        let object = JSON.parse(JSON.stringify(res));
        this.bids = object.winners;

        this.bids = this.bids.filter(i => i.user_id === id);
      },
      err => {
        console.log(err);
      }
    );

    sub.add(() => { this.getUserDeposit(id); });
  }

  getUserDeposit(id: any) {
    const sub = this.api.get('deposits/', this.token).subscribe(
      res => {
        let object = JSON.parse(JSON.stringify(res));
        this.deposits = object['deposits'];

        this.deposits = this.deposits.filter(i => i.user.id === id);
      },
      err => {
        console.log(err);
      }
    );

    sub.add(() => { this.getUserWallets(id); });
  }

  getUserWallets(id: any) {
    const sub = this.api.get('wallets/', this.token).subscribe(
      res => {
        let objects = JSON.parse(JSON.stringify(res));
        this.wallets = objects['wallets'];

        this.wallets = this.wallets.filter(i => i.user.id === id);
      },
      err => {
        console.log(err);
      }
    );

    sub.add(() => { });
  }

  requestRefund(id: any) {
    this.api.post('deposits/' + id + '/refund', {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { console.log(errr); this.errorMessage = true; }
    );
  }

  insuranceConfiscation(id: any) {
    const sub = this.api.update('wallets/confiscate/' + id, {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { console.log(errr); this.errorMessage = true; }
    );
  }

  withdraw(id: any) {
    const sub = this.api.update('wallets/withdraw/' + id, {}, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { console.log(errr); this.errorMessage = true; }
    );
  }

  itemId(id: any, note: any) {
    this.deposit_id = id;
    this.note = note;
  }

  adddNote(id: any) {
    const sub = this.api.update('deposits/' + id + '/note', { note: this.note }, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { console.log(errr); this.errorMessage = true; }
    );
  }
}
