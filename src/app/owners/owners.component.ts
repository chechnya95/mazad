import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.css']
})
export class OwnersComponent implements OnInit {


  Swal = require('sweetalert2')

  token: any;
  owners: any[] = [];
  filter_config: any;

  image: any;

  owner = {
    email: null,
    phone: null,
    code: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null
  }

  edit_owner_id: any;
  edit_owner = {
    email: null,
    code: null,
    phone: null,
    active: null,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null
  }

  owner_details = {
    cr_number: null,
    vat_number: null
  }

  edit_owner_details = {
    cr_number: null,
    vat_number: null
  }

  ownerFilter = '';

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Owners';
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      queries: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getOwnersById(id);
      }
      else { this.getOwners(); }
    })
  }

  getHttpParams() {
    let params = new HttpParams();
    params = params.append('page', this.filter_config.currentPage.toString());
    params = params.append('per_page', this.filter_config.itemsPerPage.toString());
    if (this.filter_config.sort) {
      params = params.append('sort', this.filter_config.sort);
      params = params.append('sort_order', this.filter_config.sort_order);
    }
    if (this.filter_config.queries) {
      params = params.append('queries', this.filter_config.queries);
    }
    return params;
  }
  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getOwners();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getOwners();
  }

  async getOwners() {
    this.utility.loader = true;
    const sub = this.api.get('owners/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));

        this.owners = objects.owners;
        this.filter_config.totalItems = objects['filters']['total_results'];

        this.owners = objects.owners;
        localStorage.setItem('owners', JSON.stringify(this.owners));

        this.owners.forEach(function (owner) {
          // owner.owner_details = JSON.parse(owner.owner_details)
          owner.avatar = owner.title.en ? owner.title.en.charAt(0) : owner['code'].charAt(0);
        });
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })

      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  async getOwnersById(id?: any) {
    this.utility.loader = true;
    const sub = this.api.get('owners/' + id, this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));

        this.owners = objects.owners;
        //this.filter_config.totalItems = objects['filters']['total_results'];

        this.owners = objects.owners;
        localStorage.setItem('owners', JSON.stringify(this.owners));

        this.owners.forEach(function (owner) {
          owner.avatar = owner.title.en ? owner.title.en.charAt(0) : owner['code'].charAt(0);
        });
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })

      }
    );

    sub.add(() => { this.utility.loader = false; });
  }

  OnSubmit() {
    let body = {
      email: this.owner.email,
      password: this.owner.code,
      phone: this.owner.phone,
      code: this.owner.code,
      owner_details: this.owner_details,
      title: { 'en': this.owner.title_en, 'ar': this.owner.title_ar },
      description: { 'en': this.owner.description_en, 'ar': this.owner.description_en }
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.owner.email == '') {
      alert('No enough data');
    }
    else if (emailPattern.test(String(this.owner.email).toLowerCase()) != true) {
      alert('email is not correct!');
    }
    else {
      if (this.image) {
        let formData: FormData = new FormData();
        formData.append('logo', this.image, this.image.name);
        formData.append('form', JSON.stringify(body));

        this.api.post_form("owners/", formData, this.token).subscribe(
          async data => { this.getOwners(); },
          async error => {
            Swal.fire({
              title: 'Oops...',
              text: 'Something went wrong! Please Note: (email) and (phone) cannot be duplicated!'
            })
          }
        );
      }
      else {
        this.api.post("owners/", body, this.token).subscribe(
          async data => {
            this.getOwners();
          },
          async error => {
            Swal.fire({
              title: 'Oops...',
              text: 'Something went wrong! Please Note: (email) and (phone) cannot be duplicated!'
            })
          }
        );
      }
    }
  }

  deleteOwner(id: number) {
    if (confirm("Delete this Owner?")) {
      this.api.delete("owners/" + id, this.token).subscribe(
        async data => {
          this.getOwners();
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

  editOwnerClicked(owner: any) {
    this.edit_owner = owner;
    this.edit_owner_id = owner.id;

    this.edit_owner.title_ar = owner.title['ar'];
    this.edit_owner.title_en = owner.title['en'];
    this.edit_owner.description_ar = owner.description['ar'];
    this.edit_owner.description_en = owner.description['en'];

    this.edit_owner_details = JSON.parse(this.edit_owner['owner_details']);
    this.edit_owner.active = owner.active == true ? 1 : 0;
  }

  OnUpdate(id: any) {
    console.log(this.edit_owner_details)
    let body = {
      owner_details: this.edit_owner_details,
      code: this.edit_owner.code,
      active: this.edit_owner.active,
      email: this.edit_owner.email,
      phone: this.edit_owner.phone,
      title: { 'en': this.edit_owner.title_en, 'ar': this.edit_owner.title_ar },
      description: { 'en': this.edit_owner.description_en, 'ar': this.edit_owner.description_en }
    }

    if (this.image) {
      let formData: FormData = new FormData();
      formData.append('logo', this.image, this.image.name);
      formData.append('form', JSON.stringify(body));

      const sub = this.api.update_form('owners/' + id, formData, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
      sub.add(() => { this.getOwners(); });
    }
    else {
      const sub = this.api.update('owners/' + id, body, this.token).subscribe(
        async data => { },
        async error => {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      );
      sub.add(() => { this.getOwners(); });
    }
  }

  searchOwner() {
    if (this.ownerFilter.length >= 3) {
      let field = 'title,description,email,code';
      let value = this.ownerFilter;

      this.filter_config.queries = `${field},like,${value}`;
      this.getOwners();
    }

    if (this.ownerFilter == '' || this.ownerFilter == null) {
      this.filter_config.queries = null;
      this.getOwners();
    }
  }

  imageChange(event: any) {
    let fileList: FileList = event.target.files;
    this.image = fileList[0];
  }
}
