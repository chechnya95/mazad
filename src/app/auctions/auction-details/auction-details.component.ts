import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  auction: any;
  token: any;
  items: any[] = [];
  templates: any[] = [];

  errorMessage: boolean = false;
  successMessage: boolean = false;
  approvalModal: boolean = false;
  clicked: boolean = false;
  emptyModal: boolean = false;
  approvalBtn: boolean = false;

  Swal = require('sweetalert2')

  constructor(private router: Router, private api: ApiService) {
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.auction = localStorage.getItem('auction') ? JSON.parse(localStorage.getItem('auction')) : null;

    if (this.auction) { this.getItems(); }
    else { this.router.navigate(['auctions']); }
  }

  async getItems() {
    const sub = this.api.get('items/auction/' + this.auction.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items']['items'];

        this.items.forEach((item) => {
          item.selected = false;
        })
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.getTemplates(); });
  }

  async getTemplates() {
    this.api.get('auction_templates/auction/' + this.auction.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates']['auction_templates'];
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );
  }

  checkUncheckAll() {
    if (!this.clicked) {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = true;
      });
      this.clicked = true;
      this.approvalBtn = true;
    }
    else {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = false;
      });
      this.clicked = false;
      this.approvalBtn = false;
    }
  }

  onApproveClicked() {
    let approvalList: any[] = this.items.filter(i => i.selected == true);
    this.approveMultipleItems(approvalList);
  }

  approveItem(id: any) {
    this.api.get('items/to_status/payment/' + id, this.token).subscribe(
      async data => { this.getItems(); this.successMessage = true; },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  approveMultipleItems(list: any[]) {
    let status = false;

    list.forEach((item) => {
      this.api.get('items/to_status/payment/' + item.id, this.token).subscribe(
        async data => { status = true; },
        async error => { console.log(error); status = true; }
      );
    });

    if (list.length == 0)
      this.emptyModal = true;
    else {
      if (status)
        this.successMessage = true;
      else
        this.errorMessage = true;
    }
  }
}
