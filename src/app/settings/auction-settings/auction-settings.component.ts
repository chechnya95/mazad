import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'

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
  forms: any[] = [];

  new_auction_status = {
    name: null,
    order: null
  }

  category = {
    name_en: null,
    name_ar: null,
    content_en: null,
    content_ar: null,
    css_class: null,
    order: null,
    form_id: null,
    enable: 1
  }

  edit_category_id: any;
  edit_category = {
    name_en: null,
    name_ar: null,
    content_en: null,
    content_ar: null,
    css_class: null,
    order: null,
    form_id: null,
    enable: 1
  }

  new_item_status = {
    name: null,
    order: null
  }

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo_auction')) {
      localStorage.setItem('foo_auction', 'no reload');
      window.location.reload();
      this.getAuctionStatus();
    } else {
      localStorage.removeItem('foo_auction');
      this.getAuctionStatus();
    }
  }

  async getAuctionStatus() {
    const sub = this.api.get('auctions/auction_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.auction_status = objects.auction_status;
      },
      async error => { }
    );

    sub.add(() => { this.get_forms(); });
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
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  deleteStatus(name: string) {
    this.api.delete("auctions/auction_status/" + name, this.token).subscribe(
      async data => {
        this.getAuctionStatus();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  get_forms() {
    const sub = this.api.get('forms/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.forms = objects['forms'];
      },
      async error => { }
    );

    sub.add(() => { this.getCategories(); });
  }

  async getCategories() {
    const sub = this.api.get('categories/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.categories = objects['categories'];
      },
      async error => { }
    );

    sub.add(() => { this.getItemstatus(); });
  }

  addCategory() {
    let body = {
      order: this.category.order,
      enable: this.category.enable,
      css_class: this.category.css_class,
      form_id: this.category.form_id,
      name: { 'en': this.category.name_en, 'ar': this.category.name_ar },
      content: { 'en': this.category.content_en, 'ar': this.category.content_ar },
    }

    this.api.post("categories/", body, this.token).subscribe(
      async data => {
        this.getCategories();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  deleteCategory(id: number) {
    this.api.delete("categories/" + id, this.token).subscribe(
      async data => {
        this.getCategories();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  async getItemstatus() {
    this.api.get('items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.item_status = objects.item_status;
      },
      async error => { }
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
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  deleteItemStatus(name: string) {
    this.api.delete("items/item_status/" + name, this.token).subscribe(
      async data => {
        this.getItemstatus();
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );
  }

  editItemClicked(item: any) {
    this.edit_category = item;
    this.edit_category_id = item.id;

    this.edit_category.css_class = item.css_class;
    this.edit_category.enable = item.enable;
    this.edit_category.name_ar = item.name.ar;
    this.edit_category.name_en = item.name.en;
    this.edit_category.content_ar = item.content.ar;
    this.edit_category.content_en = item.content.en;
  }

  updateCategory(id: any) {
    let body = {
      css_class: this.edit_category.css_class,
      order: this.edit_category.order,
      enable: this.edit_category.enable,
      form_id: this.edit_category.form_id,
      name: { 'en': this.edit_category.name_en, 'ar': this.edit_category.name_ar },
      content: { 'en': this.edit_category.content_en, 'ar': this.edit_category.content_ar }
    }

    const sub = this.api.update('categories/' + id, body, this.token).subscribe(
      async data => { },
      async errr => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    );

    sub.add(() => { this.getCategories(); });
  }
}
