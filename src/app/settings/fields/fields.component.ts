import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {

  token: any;
  fields: any[] = [];
  types: any[] = [];

  field = {
    field_type: null,
    enable: 1,
    note: null,
    title_ar: null,
    title_en: null,
    value_ar: null,
    value_en: null
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.get_fields();
  }

  get_fields() {
    this.utility.loader = true;
    this.api.get('fields/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.fields = objects['fields'];

        console.log(objects)
        this.utility.loader = false;
        this.get_field_types();
      },
      async error => {
        alert(error);
      }
    );
  }

  get_field_types() {
    this.api.get('fields/field_type', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.types = objects['field_type'];
      },
      async error => {
        alert(error);
      }
    );
  }

  create_field() {
    let body = {
      field_type: this.field.field_type,
      enable: this.field.enable,
      note: this.field.note,
      title: { 'en': this.field.title_en, 'ar': this.field.title_ar },
      value: { 'en': this.field.value_en, 'ar': this.field.value_ar }
    }

    this.api.post("fields/", body, this.token).subscribe(
      async data => {
        this.get_fields();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }

  on_delete(id: any) {
    if (confirm("Delete this field?")) {
      this.api.delete("fields/" + id, this.token).subscribe(
        async data => {
          this.get_fields();
        },
        async error => {
          alert("ERROR: cannot connect!");
          console.log(error);
        }
      );
    }
  }
}
