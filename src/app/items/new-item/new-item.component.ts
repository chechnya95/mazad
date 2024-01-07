import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid';
import { MdEditorOption } from 'ngx-markdown-editor';
import { TranslateService } from '@ngx-translate/core';
import { UppyService } from 'src/app/services/uppy.service';
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
    //'../../../../node_modules/@uppy/core/dist/style.css',
    //'../../../../node_modules/@uppy/dashboard/dist/style.css',
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
    terms_ar: null,
    contacts: { email: '', mobile: '' }
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

  media_id: any;
  isUploading: boolean = false;

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    usingFontAwesome5: true,
    fontAwesomeVersion: '5',
    resizable: true,
    hideIcons: ['Image'],
  };
  public mode: string = 'editor';
  public markdownText: any;

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router, public translate: TranslateService,private uppyService: UppyService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'New Item';
    this.token = localStorage.getItem('access_token');
    this.media_id = uuidv4();
    

    let lang = localStorage.getItem('lang');
    if (!lang)
      lang = 'en';
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
    });
    const imageUppy = this.uppyService.initializeUppy('image', this.media_id, this.token, '#image-uploader', true);
    const attachmentUppy = this.uppyService.initializeUppy('attachment', this.media_id, this.token, '#attachment-uploader',true);
    this.uppyService.isUploading.subscribe(uploading => {
      this.isUploading = uploading;
    });
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

  btn_disabled: boolean = false;

  OnSubmit() {
    this.utility.loader = true;
    this.btn_disabled = true;

    let start_date = new Date(this.item.start_date)
    //let start_date = `${date_s.getFullYear()}-${date_s.getMonth() + 1}-${date_s.getDate()} ${date_s.getHours()}:${date_s.getMinutes()}+0400`;

    let end_date = new Date(this.item.end_date)
    //let end_date = `${date_e.getFullYear()}-${date_e.getMonth() + 1}-${date_e.getDate()} ${date_e.getHours()}:${date_e.getMinutes()}+0400`;

    // if this.item.contacts is not null or empty, split it by ; and save it in contacts array

    const body = JSON.stringify({
      code: this.item.code,
      media_id: this.media_id,
      details: this.item_details,
      images: this.item.images,
      owner_code: this.item.owner_code,
      attachments: this.item.attachments,
      deposit: this.item.deposit,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
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
      contacts: this.item.contacts,
      title: { 'en': this.item.title_en, 'ar': this.item.title_ar },
      description: { 'en': this.item.description_en, 'ar': this.item.description_ar },
      terms: { 'en': this.item.terms_en, 'ar': this.item.terms_ar }
    })

    
    let formData: FormData = new FormData();

    
    /*
    if (this.images && this.images.length > 0) {
      for (let file of this.images) {
        formData.append('images', file.data, file.data.name);
      }
    }

    if (this.attachemetns && this.attachemetns.length > 0) {
      for (let file of this.attachemetns) {
        formData.append('attachments', file.data, file.data.name);
      }
    }*/

    formData.append('form', body);

    if (this.item.item_status && this.item.auction_id && this.item.owner_id) {
      const sub = this.api.post_form("items/", formData, this.token).subscribe(
        async data => {
          //let item_id = data['item_id'];
          //this.upload_files(this.images, item_id, 'image');
          //this.upload_files(this.attachemetns, item_id, 'attachment');

          this.item_details = [];
          this.successMessage = true;
          this.router.navigate(['items']);
        },
        async error => {
          this.errorMessage = true;
        }
      );

      sub.add(() => {
        this.btn_disabled = false;
        this.utility.loader = false;

        // if (this.successMessage) {
        //   Swal.fire(
        //     'تمت إضافة السلعة بنجاح.',
        //     'Item added successfully.',
        //     'success'
        //   );
        //   this.router.navigate(['items']);
        // }
      });
    }
    else {
      this.btn_disabled = false;
      this.utility.loader = false;

      Swal.fire({
        title: 'Info...',
        text: 'Please check all fields!'
      })
    }
  }

  upload_files(files: any[], item_id: any, type: any) {
    if (files) {
      files.forEach((file) => {
        let formData: FormData = new FormData();
        formData.append('file', file.data, file.data.name);

        this.api.post_form(`items/upload/${type}/${item_id}/1`, formData, this.token).subscribe(
          data => { },
          error => { }
        );
      });
    }
  }

  continue(type: string) {
    this.type = type;

    if (type === 'template')
      this.getTemplates();
  }

  teplateChecked(template: any) {
    console.log(template);

    this.item = template;
    this.item.template_id = template.id;
    this.item.title_ar = template?.title['ar'];
    this.item.title_en = template?.title['en'];
    this.item.description_ar = template?.description['ar'];
    this.item.description_en = template?.description['en'];
    this.item.terms_ar = template?.terms['ar'];
    this.item.terms_en = template?.terms['en'];
    this.item.item_status = 'draft';

    let owner = this.owners.find(i => i.id === this.item.owner_id);
    this.owner_name = owner?.title?.en;

    // get start date
    let start_date = new Date(template.start_date);
    if (template.next_start_date) {
      start_date = new Date(template.start_date);
    }

    this.item.start_date = this.utility.convertDateForInput(start_date.toString());

    // get end date
    const end_date = new Date(template.end_date);
    this.item.end_date = this.utility.convertDateForInput(end_date.toString());
    
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
