import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  
  token: any;
  page = 1;
  pageSize = 10;

  sent: boolean = false;
  messages: any[] = [];

  note: string = '';

  constructor(private api: ApiService,
    public utlity: UtilitiesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getMessages();
  }
  getMessages() {
    this.api.get('messages/', this.token).subscribe(
      async data => {
      this.messages = JSON.parse(JSON.stringify(data)).messages;
    }, async error => {
      console.log(error);
    })
  }

  open(content: any) {
    this.modalService.open(content);
  }

  OnReview(id: number) {
    let body = {
      note: this.note
    }

    this.api.update('messages/' + id, body, this.token).subscribe(
      async data => {
      this.getMessages();
      this.modalService.dismissAll();
    }, async error => {
      console.log(error);
    })
  }
}
