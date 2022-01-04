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
  form_name: any;

  form = {
    key: null,
    title_ar: null,
    title_en: null,
    descr_ar: null,
    descr_en: null
  }

  form_id: any;

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
    const sub = this.api.get('fields/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.fields = objects['fields'];

        this.fields.forEach(function (field) {
          field.checked = false;
        });
      },
      async error => {
        alert(error);
      }
    );

    sub.add(() => { this.getFormFields(); });
  }

  getFormFields() {
    this.api.get('form_fields/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.form_fields = objects['form_fields'];
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

  formClicked(id: any, name: any) {
    this.form_name = name;
    this.form_id = id;

    this.fields.forEach(function (field) {
      field.checked = false;
    });

    for (let x = 0; x < this.fields.length; x++) {
      for (let y = 0; y < this.form_fields.length; y++) {
        if (this.form_fields[y].form_id == this.form_id) {
          if (this.fields[x].id == this.form_fields[y].field_id) {
            this.fields[x].checked = true;
            this.fields[x].form_field_id = this.form_fields[y].id;
          }
        }
      }
    }
  }

  checkBoxChecked(field: any) {
    if (field.checked) {
      let body = {
        form_id: this.form_id,
        field_id: field.id,
        mandatory: 0,
        enable: 1,
        order: 1
      }

      this.api.post("form_fields/", body, this.token).subscribe(
        async data => {
          this.getFormFields();
        },
        async error => {
          alert("ERROR");
          console.log(error);
        }
      );
    }
    else {
      this.api.delete("form_fields/" + field.form_field_id, this.token).subscribe(
        async data => {
          // ...
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }
}
