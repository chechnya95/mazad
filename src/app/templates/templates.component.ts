import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];
  filter_config: any;

  errorMessage: boolean = false;
  successMessage: boolean = false;

  template = {
    key: null,
    model_type: null,
    model_op: null,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null
  }

  edit_template = {
    key: null,
    model_type: null,
    model_op: null,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null
  }

  edit_template_id: any;

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
    this.api.get('templates_contents/', this.token, { params: this.getHttpParams()}).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['templates_contents'];
        this.filter_config.totalItems = objects['filters']['total_results'];

        this.utility.loader = false;
      },
      async error => { }
    );
  }

  OnSubmit() {
    let body = {
      key: this.template.key,
      model_type: this.template.model_type,
      model_op: this.template.model_op,
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

    this.edit_template.subject_ar = template.subject['ar'];
    this.edit_template.subject_en = template.subject['en'];
    this.edit_template.content_ar = template.content['ar'];
    this.edit_template.content_en = template.content['en'];
  }

  OnUpdate(id: any) {
    let body = {
      key: this.edit_template.key,
      model_type: this.edit_template.model_type,
      model_op: this.edit_template.model_op,
      owner_id: null,
      model_id: null,
      subject: { 'en': this.edit_template.subject_en, 'ar': this.edit_template.subject_ar },
      content: { 'en': this.edit_template.content_en, 'ar': this.edit_template.content_ar }
    }

    const sub = this.api.update('templates_contents/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async errr => { this.errorMessage = true; }
    );

    sub.add(() => { this.getTemplates(); });
  }
}
