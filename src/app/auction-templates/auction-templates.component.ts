import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-auction-templates',
  templateUrl: './auction-templates.component.html',
  styleUrls: ['./auction-templates.component.css']
})
export class AuctionTemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];
  auctions: any[] = [];
  categories: any[] = [];
  owners: any[] = [];
  fields: any[] = [];

  auction_template = {
    code: null,
    details: null,
    images: null,
    owner_code: null,
    attachments: null,
    deposit: null,
    start_date: null,
    end_date: null,
    time_between_items: null,
    latitude: null,
    longtitude: null,
    min_bid: null,
    start_price: null,
    acceptable_price: null,
    buy_price: null,
    governorate: null,
    address: null,
    extension_period: null,
    finale_period: null,
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

  category = {
    name_en: null,
    name_ar: null,
    content_en: null,
    content_ar: null,
    order: null,
    enable: 1
  }

  item_details: any = {};

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.title = 'Auction Templates';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  async getTemplates() {
    this.api.get('auction_templates/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];

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
    this.api.get('users/type/OWNER', this.token).subscribe(
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
      },
      async error => {
        alert(error);
      }
    );
  }

  getForm() {
    let cat_id = this.auction_template.category_id;
    let form_id = null;
    if (cat_id)
      form_id = this.categories.find(i => i.id === cat_id).form_id;

    if (form_id) {
      this.api.get('form_fields/form/' + form_id, this.token).subscribe(
        async data => {
          let objects = JSON.parse(JSON.stringify(data))
          this.fields = objects['form_field'];

          for (let i = 0; i < this.fields.length; i++) {
            if (['radio', 'Checkbox', 'Select'].includes(this.fields[i].field_type)) {
              this.fields[i].values = this.fields[i].value.en.split(';');
            }
          }
        },
        async error => {
          alert(error);
        }
      );
    }
  }

  onCheckBoxClicked(title: any, value: any) {
    if (!this.item_details[title]) {
      let values = [];
      values.push(value);
      this.item_details[title] = values;
    }
    else {
      let name: any[] = this.item_details[title];
      name.push(value);
      this.item_details[title] = name;
    }
  }

  OnSubmit() {
    let body = {
      code: this.auction_template.code,
      details: this.item_details,
      images: this.auction_template.images,
      owner_code: this.auction_template.owner_code,
      attachments: this.auction_template.attachments,
      deposit: this.auction_template.deposit,
      start_date: this.auction_template.start_date,
      end_date: this.auction_template.end_date,
      latitude: this.auction_template.latitude,
      longtitude: this.auction_template.longtitude,
      time_between_items: this.auction_template.time_between_items,
      min_bid: this.auction_template.min_bid,
      start_price: this.auction_template.start_price,
      acceptable_price: this.auction_template.acceptable_price,
      buy_price: this.auction_template.buy_price,
      governorate: this.auction_template.governorate,
      address: this.auction_template.address,
      extension_period: this.auction_template.extension_period,
      finale_period: this.auction_template.finale_period,
      category_id: this.auction_template.category_id,
      owner_id: this.auction_template.owner_id,
      auction_id: this.auction_template.auction_id,
      title: { 'en': this.auction_template.title_en, 'ar': this.auction_template.title_ar },
      description: { 'en': this.auction_template.description_en, 'ar': this.auction_template.description_ar },
      terms: { 'en': this.auction_template.terms_en, 'ar': this.auction_template.terms_ar }
    }

    this.api.post("auction_templates/", body, this.token).subscribe(
      async data => {
        this.item_details = [];
        this.getTemplates();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  deleteTemplate(id: any) {
    if (confirm("Delete this template?")) {
      this.api.delete("auction_templates/" + id, this.token).subscribe(
        async data => {
          this.getTemplates();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }

  fileChange(event: any) {

  }
}
