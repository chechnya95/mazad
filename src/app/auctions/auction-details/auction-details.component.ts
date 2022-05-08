import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

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
      },
      async error => {
        alert(error);
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
        alert(error);
      }
    );
  }
}
