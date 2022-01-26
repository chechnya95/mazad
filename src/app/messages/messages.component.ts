import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  token: any;
  messages: any[] = [];

  note: string = '';
  message_id: any;

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Contacts Messages';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getMessages();
  }
  getMessages() {
    this.utility.loader = true;
    const sub = this.api.get('contactus/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.messages = objects['contactus'];
      },
      async error => {
        console.log(error);
      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  on_delete(id: any) {
    if (confirm("Delete this Message?")) {
      this.api.delete("contactus/" + id, this.token).subscribe(
        async data => {
          this.getMessages();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  on_edit_clicked(id: any) {
    this.message_id = id;
  }

  on_review(id: any) {
    let body = { note: this.note };

    const sub = this.api.update('contactus/' + id, body, this.token).subscribe(
      async data => { },
      async errr => { console.log(errr); }
    );

    sub.add(() => { this.getMessages(); });
  }
}
