import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  auction: any;
  token: any;
  items: any[] = [];
  templates: any[] = [];

  errorMessage: boolean = false;
  successMessage: boolean = false;
  approvalModal: boolean = false;
  clicked: boolean = false;
  emptyModal: boolean = false;
  approvalBtn: boolean = false;

  Swal = require('sweetalert2')

  constructor(private router: Router, private api: ApiService, public translate: TranslateService) {
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.auction = localStorage.getItem('auction') ? JSON.parse(localStorage.getItem('auction')) : null;

    if (this.auction) { this.getItems(); }
    else { this.router.navigate(['auctions']); }
  }

  async getItems() {
    const sub = this.api.get('items/auction/' + this.auction.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.items = objects['items']['items'];

        this.items.forEach((item) => {
          item.selected = false;
        })
      },
      async error => { }
    );

    sub.add(() => { this.getTemplates(); });
  }

  async getTemplates() {
    this.api.get('auction_templates/auction/' + this.auction.id, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['auction_templates']['auction_templates'];
      },
      async error => { }
    );
  }

  checkUncheckAll() {
    if (!this.clicked) {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = true;
      });
      this.clicked = true;
      this.approvalBtn = true;
    }
    else {
      this.items.forEach(item => {
        if (item.item_status.toLowerCase() == 'approval')
          item.selected = false;
      });
      this.clicked = false;
      this.approvalBtn = false;
    }
  }

  onApproveClicked() {
    let approvalList: any[] = this.items.filter(i => i.selected == true);
    this.approveMultipleItems(approvalList);
  }

  approveItem(id: any) {
    this.api.get('items/to_status/payment/' + id, this.token).subscribe(
      async data => { this.getItems(); this.successMessage = true; },
      async error => {  this.errorMessage = true; }
    );
  }

  approveMultipleItems(list: any[]) {
    let status = false;

    list.forEach((item) => {
      this.api.get('items/to_status/payment/' + item.id, this.token).subscribe(
        async data => { status = true; },
        async error => {  status = true; }
      );
    });

    if (list.length == 0)
      this.emptyModal = true;
    else {
      if (status)
        this.successMessage = true;
      else
        this.errorMessage = true;
    }
  }

  excel: any;
  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.excel = fileList[0];
  }

  export(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Are you sure to export Auction?' : 'هل تريد المواصلة لتحميل مزاد؟',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.get('auctions/export/' + id, this.token).subscribe(
          res => { },
          err => {
            Swal.fire(
              'Error!',
              'Could not send your request!'
            );
          });
      }
    });
  }

  import(id: any) {
    let lang = this.translate.currentLang == 'en' || this.translate.currentLang == null ? 'en' : 'ar';

    Swal.fire({
      title: lang == 'en' ? 'Select file' : 'اختر ملف',
      html:
        '<input type="file" class="form-control form-control-solid mb-3 mb-lg-0" id="image" accept="xlsx,xls" (change)="imageChange($event)"  />',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang == 'en' ? 'Yes' : 'نعم',
      cancelButtonText: lang == 'en' ? 'Cancel' : 'الغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        let formData: FormData = new FormData();

        if (this.excel) {
          formData.append('file', this.excel, this.excel.name);
          this.api.post('auctions/import/' + id, null, this.token).subscribe(
            res => {
              Swal.fire({
                title: 'Success',
                text: 'Done!'
              })
            },
            err => {
              Swal.fire(
                'Error!',
                'Could not send your request!'
              );
            });
        }
      }
    });
  }
}
