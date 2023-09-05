import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'

import { Uppy } from '@uppy/core'
import { MdEditorOption } from 'ngx-markdown-editor';

interface UploadResult {
  isImg: boolean
  name: string
  url: string
}

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: [
    './edit-item.component.css',
    '../node_modules/@uppy/core/dist/style.css',
    '../node_modules/@uppy/dashboard/dist/style.css',
  ]
})
export class EditItemComponent implements OnInit {

  token: any;
  items: any[] = [];
  auctions: any[] = [];
  categories: any[] = [];
  owners: any[] = [];
  item_status: any[] = [];
  fields: any[] = [];

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
    payment_period: null,
    collecting_period: null,
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

  inspections: any = {};

  new_item_status: any;
  new_item_id: any;

  item_s = {
    name: null,
    order: null
  }

  attachemetns: any;
  images: any;
  item_details: any = {};

  edit_item_id: any;
  Swal = require('sweetalert2')

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
        // out += (<any>this.options).xhtml ? '/>' : '>';
        return out;
      },
    },
  };
  public mode: string = 'editor';
  public markdownText: any;

  uppy: Uppy = new Uppy({ debug: true, autoProceed: true })
  uppy2: Uppy = new Uppy({ debug: true, autoProceed: true })

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.utility.show = true;
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
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;

      if (id)
        this.edit_item_id = id;

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
    const sub = this.api.get('auctions/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.auctions = objects['auctions']['auctions'];
      },
      async error => { }
    );

    sub.add(() => { this.getOwners(); });
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
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = { owners: [] }
        objects = data;
        this.owners = objects.owners;
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

        if (this.edit_item_id) {
          let object = localStorage.getItem('item-edit') ? JSON.parse(localStorage.getItem('item-edit')) : null;
          if (object) {
            this.item = object;

            this.item.title_ar = object.title['ar'];
            this.item.title_en = object.title['en'];
            this.item.terms_ar = object.terms['ar'];
            this.item.terms_en = object.terms['en'];
            this.item.description_ar = object.description['ar'];
            this.item.description_en = object.description['en'];

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

            this.item.start_date = date_start.getFullYear() + '-' + month_start + '-' + day_start + 'T' + hour_start + ':' + mins_start;

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

            this.item.end_date = end_date.getFullYear() + '-' + month_end + '-' + day_end + 'T' + hour_end + ':' + mins_end;

            this.inspections.inspection_start_date = object?.inspections?.inspection_start_date;
            this.inspections.inspection_start_time = object?.inspections?.inspection_start_time;
            this.inspections.inspection_end_date = object?.inspections?.inspection_end_date;
            this.inspections.inspection_end_time = object?.inspections?.inspection_end_time;

            this.item_details = object?.details;

            // add files to images dropzone
            // this.item.images.forEach((image) => {
            //   let url = image.file.file;
            //   var pattern = url.lastIndexOf('/');
            //   var file_name = url.substring(pattern + 1);
            //   this.http.get(image.file.file, { responseType: 'blob', headers: { 'Access-Control-Allow-Origin': '*' } }).subscribe(blob => {
            //     this.uppy.addFile({
            //       id: image.id,
            //       name: file_name,
            //       type: blob.type,
            //       data: blob,
            //     });
            //   });
            // });

            // add files to attachments dropzone
            // this.item.attachments.forEach((attachment) => {
            //   let url = attachment.file.file;
            //   var pattern = url.lastIndexOf('/');
            //   var file_name = url.substring(pattern + 1);
            //   this.http.get(attachment.file.file, { responseType: 'blob', headers: { 'Access-Control-Allow-Origin': '*' } }).subscribe(blob => {
            //     this.uppy2.addFile({
            //       id: attachment.id,
            //       name: file_name,
            //       type: blob.type,
            //       data: blob,
            //     });
            //   });
            // });
          }
        }
      },
      async error => { }
    );

    sub.add(() => { this.getForm(); });
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

      sub.add(() => { });
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
      current_price: this.item.current_price,
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

    this.api.update_form("items/" + this.edit_item_id, formData, this.token).subscribe(
      async data => { localStorage.removeItem('item-edit'); this.router.navigate(['items']); },
      async eror => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })

      }
    );
  }

  removeImage(image: any) {
    let index = this.item.images.indexOf(image, 0);
    this.item.images.splice(index, 1);
  }

  removeFile(file: any) {
    let index = this.item.attachments.indexOf(file, 0);
    this.item.attachments.splice(index, 1);
  }

  reload() {
    window.location.reload();
  }


  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    // do upload file by yourself
    return Promise.resolve([{ name: 'xxx', url: 'xxx.png', isImg: true }]);
  }
}
