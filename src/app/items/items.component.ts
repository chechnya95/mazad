import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  token: any;
  items: any[] = [];
  auctions: any[] = [];
  categories: any[] = [];
  owners: any[] = [];
  item_status: any[] = [];

  templates: any[] = [];

  type: string = 'empty';

  item = {
    code: null,
    details: null,
    images: null,
    owner_code: null,
    attachments: null,
    deposit: null,
    start_date: null,
    end_date: null,
    latitude: null,
    longtitude: null,
    current_price: null,
    min_bid: null,
    start_price: null,
    acceptable_price: null,
    buy_price: null,
    governorate: null,
    address: null,
    extension_period: null,
    finale_period: null,
    item_status: null,
    category_id: null,
    owner_id: null,
    auction_id: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  item_s = {
    name: null,
    order: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getItems();
  }

  async getItems() {
    this.api.get('items/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items'];
        this.getItemstatus();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getItemstatus() {
    this.api.get('items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.item_status = objects.item_status;
        this.getAuctions();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getAuctions() {
    this.api.get('auctions/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];

        this.getOwners();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getOwners() {
    this.api.get('users/role/Owner', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owners = objects['users'];

        this.getCategories();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getCategories() {
    this.api.get('categories/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.categories = objects['categories'];

        this.getTemplates();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => {
        alert(error);
      }
    );
  }

  OnSubmit() {
    let body = {
      code: this.item.code,
      details: this.item.details,
      images: this.item.images,
      owner_code: this.item.owner_code,
      attachments: this.item.attachments,
      deposit: this.item.deposit,
      start_date: this.item.start_date,
      end_date: this.item.end_date,
      latitude: this.item.latitude,
      longtitude: this.item.longtitude,
      current_price: this.item.current_price,
      min_bid: this.item.min_bid,
      start_price: this.item.start_price,
      acceptable_price: this.item.acceptable_price,
      buy_price: this.item.buy_price,
      governorate: this.item.governorate,
      address: this.item.address,
      extension_period: this.item.extension_period,
      finale_period: this.item.finale_period,
      item_status: this.item.item_status,
      category_id: this.item.category_id,
      owner_id: this.item.owner_id,
      auction_id: this.item.auction_id,
      title: { 'en': this.item.title_en, 'ar': this.item.title_ar },
      description: { 'en': this.item.description_en, 'ar': this.item.description_ar },
      terms: { 'en': this.item.terms_en, 'ar': this.item.terms_ar }
    }

    if (this.item.current_price && this.item.item_status) {
      this.api.post("items/", body, this.token).subscribe(
        async data => {
          this.getItems();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
    else {
      alert('Please check all fields!')
    }
  }

  deleteItem(id: number) {
    if (confirm("Delete this item?")) {
      this.api.delete("items/" + id, this.token).subscribe(
        async data => {
          this.getItems();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  addItemStatus() {
    let body = {
      name: this.item_s.name,
      order: this.item_s.order
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

  deleteStatus(name: string) {
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

  continue(type: string) {
    this.type = type;
  }

  teplateChecked(template: any) {
    this.item = template;

    this.item.title_ar = template.title['ar'];
    this.item.title_en = template.title['en'];
    this.item.description_ar = template.description['ar'];
    this.item.description_en = template.description['en'];
    this.item.terms_ar = template.terms['ar'];
    this.item.terms_en = template.terms['en'];

    // get start date
    var start_date = new Date(template.start_date);
    var month_1 = (start_date.getMonth() + 1).toString();
    var day_1 = (start_date.getDate()).toString();
    var hour_1 = (start_date.getHours()).toString();
    var mins_1 = (start_date.getMinutes()).toString();

    if (+month_1 < 10)
      month_1 = '0' + month_1;

    if (+day_1 < 10)
      day_1 = '0' + day_1;

    if (+hour_1 < 10)
      hour_1 = '0' + hour_1;

    if (+mins_1 < 10)
      mins_1 = '0' + mins_1;

    this.item.start_date = start_date.getFullYear() + '-' + month_1 + '-' + day_1 + 'T' + hour_1 + ':' + mins_1;

    // get end date
    var end_date = new Date(template.end_date);
    var month_2 = (end_date.getMonth() + 1).toString();
    var day_2 = (end_date.getDate()).toString();
    var hour_2 = (end_date.getHours()).toString();
    var mins_2 = (end_date.getMinutes()).toString();

    if (+month_2 < 10)
      month_2 = '0' + month_2;

    if (+day_2 < 10)
      day_2 = '0' + day_2;

    if (+hour_2 < 10)
      hour_2 = '0' + hour_2;

    if (+mins_2 < 10)
      mins_2 = '0' + mins_2;

    this.item.end_date = end_date.getFullYear() + '-' + month_2 + '-' + day_2 + 'T' + hour_2 + ':' + mins_2;
  }
}