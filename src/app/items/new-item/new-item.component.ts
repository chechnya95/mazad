import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  token: any;
  items: any[] = [];
  auctions: any[] = [];
  categories: any[] = [];
  owners: any[] = [];
  item_status: any[] = [];
  fields: any[] = [];

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
    min_bid: null,
    start_price: null,
    acceptable_price: null,
    buy_price: null,
    governorate: null,
    address: null,
    extension_period: null,
    payment_period: null,
    collecting_period: null,
    item_status: 'Draft',
    category_id: null,
    owner_id: null,
    auction_id: null,
    template_id: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  new_item_status: any;
  new_item_id: any;

  item_s = {
    name: null,
    order: null
  }

  attachemetns: any;
  images: any;
  item_details: any = {};

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'New Item';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      let ow = params['owner'] != null ? params['owner'] : null;
      
      if (id) {
        this.item.auction_id = id;
      }

      if (ow) {
        this.item.owner_id = ow;
      }
      
      this.getItemstatus();
    })
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
    this.api.get('auctions/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions'];

        this.getOwners();
      },
      async error => {
        alert(error);
      }
    );
  }

  /* async getOwners() {
    this.api.get('users/type/OWNER', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.owners = objects['users'][0];
        this.getCategories();
      },
      async error => {
        alert(error);
      }
    );
  } */

  async getOwners() {
    this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = { owners: [] }
        objects = data;
        this.owners = objects.owners;

        this.owners.forEach(function (owner) {
          if (owner.title) {
            let title = owner.title;
            owner.contact = title.en ? title.en : title.ar ? title.ar : owner.phone;
          }
          else {
            owner.contact = owner.email ? owner.email : owner.phone;
          }
        });
        
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

        //this.getTemplates();
      },
      async error => {
        alert(error);
      }
    );
  }

  async getTemplates() {
    this.api.get('auction_templates/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];

        this.utility.loader = false;
      },
      async error => {
        alert(error);
      }
    );
  }

  imageChange(event) {
    let imageList: FileList = event.target.files;
    this.images = imageList;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    this.attachemetns = fileList;
  }

  getForm() {
    let cat_id = this.item.category_id;
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
    const body = JSON.stringify({
      code: this.item.code,
      details: this.item_details,
      images: this.item.images,
      owner_code: this.item.owner_code,
      attachments: this.item.attachments,
      deposit: this.item.deposit,
      start_date: this.item.start_date,
      end_date: this.item.end_date,
      latitude: this.item.latitude,
      longtitude: this.item.longtitude,
      min_bid: this.item.min_bid,
      start_price: this.item.start_price,
      acceptable_price: this.item.acceptable_price,
      buy_price: this.item.buy_price,
      governorate: this.item.governorate,
      address: this.item.address,
      extension_period: this.item.extension_period,
      payment_period: this.item.payment_period,
      collecting_period: this.item.collecting_period,
      item_status: this.item.item_status,
      category_id: this.item.category_id,
      owner_id: this.item.owner_id,
      auction_id: this.item.auction_id,
      template_id: this.item.template_id,
      title: { 'en': this.item.title_en, 'ar': this.item.title_ar },
      description: { 'en': this.item.description_en, 'ar': this.item.description_ar },
      terms: { 'en': this.item.terms_en, 'ar': this.item.terms_ar }
    })

    let formData: FormData = new FormData();

    if (this.images && this.images.length > 0) {
      for (let file of this.images) {
        formData.append('images', file, file.name);
      }
    }

    if (this.attachemetns && this.attachemetns.length > 0) {
      for (let file of this.attachemetns) {
        formData.append('attachments', file, file.name);
      }
    }

    formData.append('form', body);

    if (this.item.item_status && this.item.auction_id && this.item.owner_id) {
      this.api.post_form("items/", formData, this.token).subscribe(
        async data => {
          this.item_details = [];
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

  continue(type: string) {
    this.type = type;

    if (type === 'template')
      this.getTemplates();
  }

  teplateChecked(template: any) {
    this.item = template;

    this.item.template_id = template.id;
    this.item.title_ar = template.title['ar'];
    this.item.title_en = template.title['en'];
    this.item.description_ar = template.description['ar'];
    this.item.description_en = template.description['en'];
    this.item.terms_ar = template.terms['ar'];
    this.item.terms_en = template.terms['en'];
    this.item.item_status = 'Draft';

    // get start date
    var start_date = new Date(template.start_date);
    if (template.next_start_date) {
      start_date = new Date(template.start_date);
    }
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

    this.item_details = template.details;

    if (this.item.category_id)
      this.getForm();
  }

  reload() {
    window.location.reload();
  }

  onChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.item.owner_id = owner.id;
  }
}
