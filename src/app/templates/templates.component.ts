import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];
  media_type: any[] = [];
  owners: any[] = [];
  filter_config: any;
  filter_config2: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  template = {
    key: null,
    model_type: null,
    media_type: 'SMS',
    model_op: null,
    customized: false,
    is_custoizable: false,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null,
    owner_id:  null
  }

  edit_template = {
    key: null,
    model_type: null,
    media_type: 'SMS',
    model_op: null,
    customized: false,
    is_custoizable: false,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null,
    owner_id:  null
  }
  
  copy_template = {
    key: null,
    model_type: null,
    media_type: 'SMS',
    model_op: null,
    customized: false,
    is_custoizable: false,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null,
    owner_id:  null
  }

  edit_template_id: any;
  copy_template_id: any;

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
    this.filter_config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
      sort: null,
      sort_order: 'asc',
      pageSizeOptions: [5, 10, 25, 100]
    };
    this.filter_config2 = {
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: 0
    };
  }

  ngOnInit(): void {
    this.getTemplates();
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

  getHttpParams2() {
    let params = new HttpParams();
    params = params.append('page', this.filter_config2.currentPage.toString());
    params = params.append('per_page', this.filter_config2.itemsPerPage.toString());
    return params;
  }

  pageChangeEvent(event: PageEvent) {
    this.filter_config.currentPage = event.pageIndex + 1;
    this.filter_config.itemsPerPage = event.pageSize;
    this.getTemplates();
  }

  sortData(sort: Sort) {
    this.filter_config.sort = sort.active;
    this.filter_config.sort_order = sort.direction;
    this.getTemplates();
  }

  async getTemplates() {
    this.utility.loader = true;
    const sub = this.api.get('templates_contents/', this.token, { params: this.getHttpParams() }).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['templates_contents'];
        this.filter_config.totalItems = objects['filters']['total_results'];
      },
      async error => { }
    );

    sub.add(() => { this.getMediaTypes(); });
  }

  getMediaTypes() {
    const sub = this.api.get('templates_contents/media_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.media_type = objects['media_type'];

        //console.log(this.media_type)
      },
      async error => { }
    );

    sub.add(() => { this.getOwners() });
  }

  async getOwners() {
    const sub = this.api.get('owners/', this.token, { params: this.getHttpParams2() }).subscribe(
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
      },
      async error => { }
    );

    sub.add(() => { this.utility.loader = false; })
  }

  owner_name: any;
  onEditChangeOwner(owner_contact?: any) {
    let owner = this.owners.find(i => i.contact === owner_contact);
    this.copy_template.owner_id = owner.id;
    this.owner_name = this.owners.find(i => i.id === this.copy_template.owner_id).title.ar;
  }

  OnSubmit() {
    let body = {
      key: this.template.key,
      model_type: this.template.model_type,
      media_type: this.template.media_type.toLowerCase(),
      model_op: this.template.model_op,
      customized: this.template.customized,
      is_custoizable: this.template.is_custoizable,
      owner_id: this.template.owner_id,
      //owner_id: null,
      //model_id: null,
      subject: { 'en': this.template.subject_en, 'ar': this.template.subject_ar },
      content: { 'en': this.template.content_en, 'ar': this.template.content_ar }
    }

    const sub = this.api.post("templates_contents/", body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTemplates(); });
  }

  deleteTemplate(id: number) {
    if (confirm("Delete this template?")) {
      const sub = this.api.delete("templates_contents/" + id, this.token).subscribe(
        async data => { this.successMessage = true; },
        async error => { this.errorMessage = true; }
      );

      sub.add(() => { this.getTemplates(); });
    }
  }

  editTemplateClicked(template: any) {
    this.edit_template = template;
    this.edit_template_id = template.id;
    if (template.owner)
      this.edit_template.owner_id = template.owner.id;
    else
      this.edit_template.owner_id = template.owner_id;

    this.edit_template.media_type = template.media_type.toUpperCase();
    this.edit_template.customized = template.customized;
    this.edit_template.is_custoizable = template.is_custoizable;

    this.edit_template.subject_ar = template.subject['ar'];
    this.edit_template.subject_en = template.subject['en'];
    this.edit_template.content_ar = template.content['ar'];
    this.edit_template.content_en = template.content['en'];
  }
  
  copyTemplateClicked(template: any) {
    this.copy_template = template;
    this.copy_template_id = template.id;

    this.copy_template.media_type = template.media_type.toUpperCase();
    this.copy_template.customized = true;
    this.copy_template.is_custoizable = template.is_custoizable;

    this.copy_template.subject_ar = template.subject['ar'];
    this.copy_template.subject_en = template.subject['en'];
    this.copy_template.content_ar = template.content['ar'];
    this.copy_template.content_en = template.content['en'];
  }

  OnUpdate(id: any) {
    let body = {
      key: this.edit_template.key,
      model_type: this.edit_template.model_type,
      media_type: this.edit_template.media_type.toLowerCase(),
      model_op: this.edit_template.model_op,
      owner_id: this.edit_template.owner_id,
      model_id: null,
      customized : this.edit_template.customized,
      is_custoizable: this.edit_template.is_custoizable,
      subject: { 'en': this.edit_template.subject_en, 'ar': this.edit_template.subject_ar },
      content: { 'en': this.edit_template.content_en, 'ar': this.edit_template.content_ar }
    }

    const sub = this.api.update('templates_contents/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTemplates(); });
  }
  
  OnCloneTemplate() {
    let body = {
      key: this.copy_template.key,
      model_type: this.copy_template.model_type,
      media_type: this.copy_template.media_type.toLowerCase(),
      model_op: this.copy_template.model_op,
      owner_id: this.copy_template.owner_id,
      customized : this.copy_template.customized,
      is_custoizable: this.copy_template.is_custoizable,
      subject: { 'en': this.copy_template.subject_en, 'ar': this.copy_template.subject_ar },
      content: { 'en': this.copy_template.content_en, 'ar': this.copy_template.content_ar }
    }

    const sub = this.api.post('templates_contents/', body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTemplates(); });
  }
}
