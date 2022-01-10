import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-auction-settings',
  templateUrl: './auction-settings.component.html',
  styleUrls: ['./auction-settings.component.css']
})
export class AuctionSettingsComponent implements OnInit {

  token: any;
  auction_status: any[] = [];
  item_status: any[] = [];
  categories: any[] = [];

  new_auction_status = {
    name: null,
    order: null
  }

  category = {
    name_en: null,
    name_ar: null,
    content_en: null,
    content_ar: null,
    order: null,
    enable: 1
  }

  new_item_status = {
    name: null,
    order: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getAuctionStatus();
  }

  async getAuctionStatus() {
    const sub = this.api.get('auctions/auction_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.auction_status = objects.auction_status;
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getCategories(); });
  }

  addAuctionStatus() {
    let body = {
      name: this.new_auction_status.name,
      order: this.new_auction_status.order
    }

    this.api.post("auctions/auction_status", body, this.token).subscribe(
      async data => {
        this.getAuctionStatus();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  deleteStatus(name: string) {
    this.api.delete("auctions/auction_status/" + name, this.token).subscribe(
      async data => {
        this.getAuctionStatus();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  async getCategories() {
    const sub = this.api.get('categories/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.categories = objects['categories'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getItemstatus(); });
  }

  addCategory() {
    let body = {
      order: this.category.order,
      enable: this.category.enable,
      name: { 'en': this.category.name_en, 'ar': this.category.name_ar },
      content: { 'en': this.category.content_en, 'ar': this.category.content_ar },
    }

    this.api.post("categories/", body, this.token).subscribe(
      async data => {
        this.getCategories();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  deleteCategory(id: number) {
    this.api.delete("categories/" + id, this.token).subscribe(
      async data => {
        this.getCategories();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  async getItemstatus() {
    this.api.get('items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.item_status = objects.item_status;
      },
      async error => {
        alert(error);
      }
    );
  }

  addItemStatus() {
    let body = {
      name: this.new_item_status.name,
      order: this.new_item_status.order
    }

    this.api.post("items/item_status", body, this.token).subscribe(
      async data => {
        this.getItemstatus();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  deleteItemStatus(name: string) {
    this.api.delete("items/item_status/" + name, this.token).subscribe(
      async data => {
        this.getItemstatus();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }
}
