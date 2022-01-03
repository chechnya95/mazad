import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css']
})
export class FormFieldsComponent implements OnInit {

  token: any;
  fields: any[] = [];
  forms: any[] = [];
  form_fields: any[] = [];

  form = {
    key: null,
    title_ar: null,
    title_en: null,
    descr_ar: null,
    descr_en: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.get_forms();
  }

  get_forms() {
    this.utility.loader = true;
    const sub = this.api.get('forms/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.forms = objects['forms'];
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.get_fields(); this.utility.loader = false; });
  }

  get_fields() {
    this.api.get('fields/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.fields = objects['fields'];
      },
      async error => {
        alert(error);
      }
    );
  }

  create_form() {
    let body = {
      key: this.form.key,
      title: { 'en': this.form.title_en, 'ar': this.form.title_ar },
      description: { 'en': this.form.descr_en, 'ar': this.form.descr_ar }
    }

    this.api.post("forms/", body, this.token).subscribe(
      async data => {
        this.get_forms();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }
}
