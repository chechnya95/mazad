import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'

import { Uppy } from '@uppy/core'
import { MdEditorOption } from 'ngx-markdown-editor';
import { TranslateService } from '@ngx-translate/core';

interface UploadResult {
  isImg: boolean
  name: string
  url: string
}

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: [
    './new-item.component.css',
    '../node_modules/@uppy/core/dist/style.css',
    '../node_modules/@uppy/dashboard/dist/style.css',
  ]
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
  owner_name: string = null;

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
    item_status: 'draft',
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

  inspections: any = {};

  attachemetns: any;
  images: any;
  item_details: any = {};

  errorMessage: boolean = false;
  successMessage: boolean = false;
  isOwner: boolean = false;

  Swal = require('sweetalert2')

  uppy: Uppy = new Uppy({ debug: true, autoProceed: true })
  uppy2: Uppy = new Uppy({ debug: true, autoProceed: true })

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    usingFontAwesome5: true,
    fontAwesomeVersion: '5',
    resizable: true,
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        //console.log(this);
        // out += (<any>this.options).xhtml ? '/>' : '>';
        return out;
      },
    },
  };
  public mode: string = 'editor';
  public markdownText: any;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'New Item';
    this.token = localStorage.getItem('access_token');

    this.doUpload = this.doUpload.bind(this);

    this.uppy.on('complete', (result) => {
      console.log('Upload complete! We’ve uploaded these files:', result.successful)
      this.images = result.successful;
    })

    this.uppy2.on('complete', (result) => {
      console.log('Upload complete! We’ve uploaded these files:', result.successful)
      this.attachemetns = result.successful;
    })

    let lang = localStorage.getItem('lang');
    this.translate.use(lang);
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
    const sub = this.api.get('items/item_status', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.item_status = objects.item_status;
      },
      async error => { }
    );

    sub.add(() => { this.getAuctions(); });
  }

  async getAuctions() {
    const sub = this.api.get('auctions/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions'];
      },
      async error => { }
    );

    sub.add(() => { this.getOwners(); });
  }

  async getOwners() {
    const sub = this.api.get('owners/', this.token).subscribe(
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

        if (this.item.owner_id) this.owner_name = this.owners.find(i => i.id === this.item.owner_id).title.ar;
      },
      async error => {
        if (error.status == 403) this.isOwner = true;
      }
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
  }

  async getTemplates() {
    const sub = this.api.get('auction_templates/active', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates'];
      },
      async error => { }
    );

    sub.add(() => { });
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
    let date_s = new Date(this.item.start_date)
    let start_date = `${date_s.getFullYear()}-${date_s.getMonth() + 1}-${date_s.getDate()} ${date_s.getHours()}:${date_s.getMinutes()}+0400`;
    
    let date_e = new Date(this.item.end_date)
    let end_date = `${date_e.getFullYear()}-${date_e.getMonth() + 1}-${date_e.getDate()} ${date_e.getHours()}:${date_e.getMinutes()}+0400`;

    const body = JSON.stringify({
      code: this.item.code,
      details: this.item_details,
      images: this.item.images,
      owner_code: this.item.owner_code,
      attachments: this.item.attachments,
      deposit: this.item.deposit,
      start_date: start_date,
      end_date: end_date,
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
      inspections: this.inspections,
      title: { 'en': this.item.title_en, 'ar': this.item.title_ar },
      description: { 'en': this.item.description_en, 'ar': this.item.description_ar },
      terms: { 'en': this.item.terms_en, 'ar': this.item.terms_ar }
    })

    let formData: FormData = new FormData();

    if (this.images && this.images.length > 0) {
      for (let file of this.images) {
        formData.append('images', file.data, file.data.name);
      }
    }

    if (this.attachemetns && this.attachemetns.length > 0) {
      for (let file of this.attachemetns) {
        formData.append('attachments', file.data, file.data.name);
      }
    }

    formData.append('form', body);

    if (this.item.item_status && this.item.auction_id && this.item.owner_id) {
      this.api.post_form("items/", formData, this.token).subscribe(
        async data => {
          this.item_details = [];
          this.successMessage = true;
          this.router.navigate(['items']);
        },
        async error => {
          this.errorMessage = true;
        }
      );
    }
    else {
      Swal.fire({
        title: 'Info...',
        text: 'Please check all fields!'
      })
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
    this.item.item_status = 'draft';
    
    let owner = this.owners.find(i => i.id === this.item.owner_id);
    this.owner_name = owner.title.en;

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
    this.inspections = template.inspections;

    if (this.item.category_id)
      this.getForm();
  }

  reload() {
    window.location.reload();
  }

  onChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.item.owner_id = owner.id;
    this.owner_name = owner.title.en;
  }

  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    // do upload file by yourself
    return Promise.resolve([{ name: 'xxx', url: 'xxx.png', isImg: true }]);
  }
}
