import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-sms-notifications',
  templateUrl: './sms-notifications.component.html',
  styleUrls: ['./sms-notifications.component.css']
})
export class SmsNotificationsComponent implements OnInit {

  token: any;
  messages: any[] = [];

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getSMSs();
  }

  getSMSs() {
    this.utility.loader = true;
    const sub = this.api.get('sms_notifications/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.messages = objects['sms_notifications'];
      },
      async error => {
        console.log(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }
}
