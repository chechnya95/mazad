import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})
export class DepositsComponent implements OnInit {

  token: any;
  deposits: any[] = [];

  depositFilter = '';

  note: any;
  deposit_id: any;

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Deposits Page';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getDeposits();
  }

  getDeposits() {
    this.utility.loader = true;
    const sub = this.api.get('deposits/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.deposits = objects['deposits'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  itemId(id: any, note: any) {
    this.deposit_id = id;
    this.note = note;
  }

  adddNote(id: any) {
    const sub = this.api.update('deposits/' + id + '/note', { note: this.note }, this.token).subscribe(
      async data => { this.getDeposits(); },
      async errr => { console.log(errr); }
    );
  }
}
