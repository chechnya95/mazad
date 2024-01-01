import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import Swal from 'sweetalert2'
import { UppyService } from 'src/app/services/uppy.service';
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
    //'../../../../node_modules/@uppy/core/dist/style.css',
    //'../../../../node_modules/@uppy/dashboard/dist/style.css',
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
    terms_ar: null,
    contacts: null
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

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, private router: Router, private uppyService: UppyService) {
    this.utility.show = true;
    this.utility.title = 'New Item';
    this.token = localStorage.getItem('access_token');

    this.doUpload = this.doUpload.bind(this);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;

      if (id)
        this.edit_item_id = id;

      this.getItemstatus();
    });
    const imageUppy = this.uppyService.initializeUppy('image', this.edit_item_id, this.token, '#image-uploader', false);
    const attachmentUppy = this.uppyService.initializeUppy('attachment', this.edit_item_id, this.token, '#attachment-uploader', false);
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

            let start_date = new Date(object.start_date);
            this.item.start_date = this.utility.convertDateForInput(start_date.toString());

            let end_date = new Date(object.end_date);
            this.item.end_date = this.utility.convertDateForInput(end_date.toString());

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
    this.utility.loader = true;

    let start_date = new Date(this.item.start_date)
    //let start_date = `${date_s.getFullYear()}-${date_s.getMonth() + 1}-${date_s.getDate()} ${date_s.getHours()}:${date_s.getMinutes()}+0400`;

    let end_date = new Date(this.item.end_date)
    //let end_date = `${date_e.getFullYear()}-${date_e.getMonth() + 1}-${date_e.getDate()} ${date_e.getHours()}:${date_e.getMinutes()}+0400`;

    // if this.item.contacts is not null or empty, split it by ; and save it in contacts array
    let contacts = [];
    if (this.item.contacts) {
      contacts = this.item.contacts.split(';');
    }

    const body = JSON.stringify({
      code: this.item.code,
      details: this.item_details,
      images: this.item.images,
      owner_code: this.item.owner_code,
      attachments: this.item.attachments,
      deposit: this.item.deposit,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
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
      contacts: JSON.stringify(contacts),
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
    }
    */
    formData.append('form', body);

    const sub = this.api.update_form("items/" + this.edit_item_id, formData, this.token).subscribe(
      async data => { localStorage.removeItem('item-edit'); this.router.navigate(['items']); },
      async eror => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })

      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  removeImage(image: any) {
    this.deleteUploadedFile(image.id);
    let index = this.item.images.indexOf(image, 0);;
    this.item.images.splice(index, 1);
  }

  removeFile(file: any) {
    this.deleteUploadedFile(file.id);
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

  deleteUploadedFile(id: any) {
    this.api.delete("items/upload/" + id, this.token).subscribe(
      async data => {
        Swal.fire(
          'Success!',
          'Deleted Successflly!'
        );
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
