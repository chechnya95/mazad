import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.css']
})
export class NewTemplateComponent implements OnInit {

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
    payment_period: null,
    collecting_period: null,
    latitude: null,
    longtitude: null,
    min_bid: null,
    start_price: null,
    acceptable_price: null,
    buy_price: null,
    governorate: null,
    address: null,
    extension_period: null,
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

  inspections: any = {};

  item_details: any = {};

  update: boolean = false;
  edit_item_id: any;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.title = 'Auction Templates';
    this.token = localStorage.getItem('access_token');

    let lang = localStorage.getItem('lang');
    this.translate.use(lang);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;

      this.getAuctions(id);
    });
  }

  async getAuctions(item_id: any) {
    const sub = this.api.get('auctions/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions'];
      },
      async error => { }
    );

    sub.add(() => { this.getOwners(item_id); });
  }

  /* async getOwners(item_id: any) {
    this.api.get('users/type/OWNER', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owners = objects['users'][0];

        this.getCategories(item_id);
      },
      async error => {
        alert(error);
      }
    );
  } */

  async getOwners(item_id: any) {
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = { owners: [] }
        objects = data;
        this.owners = objects.owners;
      },
      async error => { }
    );

    sub.add(() => { this.getCategories(item_id); });
  }

  async getCategories(item_id: any) {
    const sub = this.api.get('categories/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.categories = objects['categories'];

        if (item_id) {
          this.edit_item_id = item_id;
          this.update = true;

          let object = localStorage.getItem('item-template') ? JSON.parse(localStorage.getItem('item-template')) : null;
          if (object) {
            this.auction_template = object;

            this.auction_template.title_ar = object.title['ar'];
            this.auction_template.title_en = object.title['en'];
            this.auction_template.terms_ar = object.terms['ar'];
            this.auction_template.terms_en = object.terms['en'];
            this.auction_template.description_ar = object.description['ar'];
            this.auction_template.description_en = object.description['en'];

            var date_start = new Date(object.start_date);
            var month_start = (date_start.getMonth() + 1).toString();
            var day_start = (date_start.getDate()).toString();
            var hour_start = (date_start.getHours()).toString();
            var mins_start = (date_start.getMinutes()).toString();

            if (+month_start < 10)
              month_start = '0' + month_start;

            if (+day_start < 10)
              day_start = '0' + day_start;

            if (+hour_start < 10)
              hour_start = '0' + hour_start;

            if (+mins_start < 10)
              mins_start = '0' + mins_start;

            this.auction_template.start_date = date_start.getFullYear() + '-' + month_start + '-' + day_start + 'T' + hour_start + ':' + mins_start;

            var end_date = new Date(object.end_date);
            var month_end = (end_date.getMonth() + 1).toString();
            var day_end = (end_date.getDate()).toString();
            var hour_end = (end_date.getHours()).toString();
            var mins_end = (end_date.getMinutes()).toString();

            if (+month_end < 10)
              month_end = '0' + month_end;

            if (+day_end < 10)
              day_end = '0' + day_end;
            if (+hour_end < 10)
              hour_end = '0' + hour_end;

            if (+mins_end < 10)
              mins_end = '0' + mins_end;

            this.auction_template.end_date = end_date.getFullYear() + '-' + month_end + '-' + day_end + 'T' + hour_end + ':' + mins_end;

            this.inspections.inspection_start_date = object?.inspections?.inspection_start_date;
            this.inspections.inspection_start_time = object?.inspections?.inspection_start_time;
            this.inspections.inspection_end_date = object?.inspections?.inspection_end_date;
            this.inspections.inspection_end_time = object?.inspections?.inspection_end_time;
          }
        }
      },
      async error => { }
    );

    sub.add(() => { this.getForm(); });
  }

  getForm() {
    let cat_id = this.auction_template.category_id;
    let form_id = null;

    if (cat_id)
      form_id = this.categories.find(i => i.id === cat_id).form_id;

    if (form_id) {
      const sub = this.api.get('form_fields/form/' + form_id, this.token).subscribe(
        async data => {
          let objects = JSON.parse(JSON.stringify(data))
          this.fields = objects['form_field'];

          for (let i = 0; i < this.fields.length; i++) {
            if (['radio', 'Checkbox', 'Select'].includes(this.fields[i].field_type)) {
              this.fields[i].values = this.fields[i].value.en.split(';');
            }
          }
        },
        async error => { }
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
      payment_period: this.auction_template.payment_period,
      collecting_period: this.auction_template.collecting_period,
      min_bid: this.auction_template.min_bid,
      start_price: this.auction_template.start_price,
      acceptable_price: this.auction_template.acceptable_price,
      buy_price: this.auction_template.buy_price,
      governorate: this.auction_template.governorate,
      address: this.auction_template.address,
      extension_period: this.auction_template.extension_period,
      category_id: this.auction_template.category_id,
      owner_id: this.auction_template.owner_id,
      auction_id: this.auction_template.auction_id,
      inspections: this.inspections,
      title: { 'en': this.auction_template.title_en, 'ar': this.auction_template.title_ar },
      description: { 'en': this.auction_template.description_en, 'ar': this.auction_template.description_ar },
      terms: { 'en': this.auction_template.terms_en, 'ar': this.auction_template.terms_ar }
    }

    if (this.update) {
      this.api.update("auction_templates/" + this.edit_item_id, body, this.token).subscribe(
        async data => { localStorage.removeItem('item-template'); },
        async eror => { alert("ERROR: cannot connect!"); }
      );
    }
    else {
      this.api.post("auction_templates/", body, this.token).subscribe(
        async data => {
          this.item_details = [];
        },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
    }
  }

  reload() {
    window.location.reload();
  }
}
