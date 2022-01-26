import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.css']
})
export class WinnersComponent implements OnInit {

  token: any;
  winners: any[] = [];

  sms = {
    mobile: null,
    user_id: null,
    local: 'AR',
    status: 'pending',
    message: 'لقد فزت في المزاد. يرجى دفع قيمة الغرض من بوابة مزاد عمان. '
  }

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Winners Page';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getWinners();
  }

  getWinners() {
    this.utility.loader = true;
    const sub = this.api.get('bids/winners', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.winners = objects['winners'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  getUser(user_id: any, mobile: any) {
    this.sms.mobile = '968' + mobile;
    this.sms.user_id = user_id;
  }

  getMessage() {
    if (this.sms.local == 'EN') {
      this.sms.message = "You have win the auction in Mazad Oman. Please Pay Auction fees from Mazad Oman Website. Mazad Oman"
    }
    else {
      this.sms.message = "لقد فزت في المزاد. يرجى دفع قيمة الغرض من بوابة مزاد عمان. "
    }
  }

  sendNotification() {
    let body = {
      mobile: this.sms.mobile,
      user_id: this.sms.user_id,
      local: this.sms.local,
      status: this.sms.status,
      message: this.sms.message
    }

    this.api.post("sms_notifications/", body, this.token).subscribe(
      async data => {
        //this.getMessages();
        alert("Message Sent.. :) ")
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }
}
