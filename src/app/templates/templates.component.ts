import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  token: any;
  templates: any[] = [];

  template = {
    key: null,
    model_type: null,
    model_op: null,
    subject_en: null,
    subject_ar: null,
    content_en: null,
    content_ar: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  async getTemplates() {
    this.utility.loader = true;
    this.api.get('templates_contents/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.templates = objects['templates_contents'];

        this.utility.loader = false;
      },
      async error => {
        alert(error);
      }
    );
  }

  OnSubmit() {
    let body = {
      key: this.template.key,
      model_type: this.template.model_type,
      model_op: this.template.model_op,
      subject: { 'en': this.template.subject_en, 'ar': this.template.subject_ar },
      content: { 'en': this.template.content_en, 'ar': this.template.content_ar }
    }

    this.api.post("templates_contents/", body, this.token).subscribe(
      async data => {
        this.getTemplates();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  deleteTemplate(id: number) {
    if (confirm("Delete this template?")) {
      this.api.delete("templates_contents/" + id, this.token).subscribe(
        async data => {
          this.getTemplates();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }
}
