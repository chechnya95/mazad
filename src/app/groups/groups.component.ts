import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  token: any;
  groups: any[] = [];
  users: any[] = [];
  owners: any[] = [];
  types: any[] = [];
  filter_config: any;

  group = {
    group_type: null,
    owner_id: null,
    enable: false,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  edit_group = {
    group_type: null,
    owner_id: null,
    enable: false,
    title_en: null,
    title_ar: null,
    description_en: null,
    description_ar: null,
    terms_en: null,
    terms_ar: null
  }

  user_id: any = null;
  edit_group_id: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  Swal = require('sweetalert2')

  constructor(public utility: UtilitiesService, private api: ApiService, private route: ActivatedRoute) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Groups';
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'] != null ? params['id'] : null;
      if (id) {
        this.getGroups(id);
      }
      else { this.getGroups(); }
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
    return params;
  }
  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getGroups();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getGroups();
  }

  getGroups(id?: any) {
    this.utility.loader = true;
    const sub = this.api.get('groups/', this.token, this.getHttpParams()).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.groups = objects['groups'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        localStorage.setItem('groups', JSON.stringify(this.groups));

        if (id)
          this.groups = this.groups.filter(i => i.id === id);
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.utility.loader = false; this.getOwners() });
  }

  async getUsers() {
    const sub = this.api.get('users/', this.token).subscribe(
      async data => {
        let objects: any = {
          users: []
        }
        objects = data;

        this.users = objects.users;
        this.users.forEach(function (user) {
          user.contact = user.email ? user.email : user.phone;
        });
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { });
  }

  async getOwners() {
    const sub = this.api.get('owners/', this.token).subscribe(
      async data => {
        let objects: any = {
          owners: []
        }
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
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.getGroupTypes(); });
  }

  async getGroupTypes() {
    const sub = this.api.get('groups/group_type', this.token).subscribe(
      async data => {
        let objects: any = {}
        objects = data;

        this.types = objects;
      },
      async error => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!'
        })
        console.log(error);
      }
    );

    sub.add(() => { this.getUsers(); });
  }

  OnSubmit() {
    let body = {
      group_type: this.group.group_type,
      owner_id: this.group.owner_id,
      enable: this.group.enable,
      title: { 'en': this.group.title_en, 'ar': this.group.title_ar },
      description: { 'en': this.group.description_en, 'ar': this.group.description_ar },
      terms: { 'en': this.group.terms_en, 'ar': this.group.terms_ar }
    }

    this.api.post('groups/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getGroups();
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  editGroupClicked(group: any) {
    this.edit_group = group;
    this.edit_group_id = group.id;

    this.edit_group.description_ar = group.description.ar;
    this.edit_group.description_en = group.description.en;
    this.edit_group.title_ar = group.title.ar;
    this.edit_group.title_en = group.title.en;
    this.edit_group.terms_ar = group.terms.ar;
    this.edit_group.terms_en = group.terms.en;
  }

  OnUpdate(id: any) {
    let body = {
      group_type: this.edit_group.group_type,
      owner_id: this.edit_group.owner_id,
      enable: this.edit_group.enable,
      title: { 'en': this.edit_group.title_en, 'ar': this.edit_group.title_ar },
      description: { 'en': this.edit_group.description_en, 'ar': this.edit_group.description_ar },
      terms: { 'en': this.edit_group.terms_en, 'ar': this.edit_group.terms_ar }
    }

    const sub = this.api.update('groups/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { console.log(errr); this.errorMessage = true; }
    );

    sub.add(() => { this.getGroups(); });
  }

  addUserToGroup(group_id: any) {
    let body = {
      user_id: this.user_id,
      group_id: group_id
    }

    this.api.post('group_users/', body, this.token).subscribe(
      async data => {
        this.successMessage = true;
        //this.getGroups(null);
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  removeGroup(id) {
    this.api.delete('groups/' + id, this.token).subscribe(
      async data => {
        this.successMessage = true;
        this.getGroups();
      },
      async error => { console.log(error); this.errorMessage = true; }
    );
  }

  onChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.group.owner_id = owner.id;
    this.edit_group.owner_id = owner.id;
  }

  getOwnerName(id?: any) {
    let owner = this.owners.find(i => i.id === id);

    return owner?.contact;
  }
}
