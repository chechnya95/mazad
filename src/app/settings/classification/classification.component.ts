import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit {

  token: any;

  classifications: any[] = [];
  types: any[] = [];

  classification = {
    parent_id: null,
    enable: 1,
    name_ar: null,
    name_en: null,
    content_ar: null,
    content_en: null,
    order: 0
  }

  edit_classification_id: any;
  edit_classification = {
    parent_id: null,
    enable: 1,
    name_ar: null,
    name_en: null,
    content_ar: null,
    content_en: null,
    order: 0
  }


  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getClassifications();
  }

  getClassifications() {
    this.api.get('classifications/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.classifications = objects['classifications'];
      },
      async error => {
        alert(error);
      }
    );
  }

  editItemClicked(item: any) {
    this.edit_classification = item;
    this.edit_classification_id = item.id;

    this.edit_classification.enable = item.enable;
    this.edit_classification.name_ar = item.name.ar;
    this.edit_classification.name_en = item.name.en;
    this.edit_classification.content_ar = item.content.ar;
    this.edit_classification.content_en = item.content.ar;
  }

  on_delete(id: any) {
    if (confirm("Delete this field?")) {
      const sub = this.api.delete("fields/" + id, this.token).subscribe(
        async data => { this.successMessage = true; },
        async error => { console.log(error); this.errorMessage = true; }
      );
      sub.add(() => { this.getClassifications(); });
    }
  }

  OnUpdate(id: any) {
    let body = {
      parent_id: this.edit_classification.parent_id,
      enable: this.edit_classification.enable,
      name: { 'en': this.edit_classification.name_en, 'ar': this.edit_classification.name_ar },
      content: { 'en': this.edit_classification.content_en, 'ar': this.edit_classification.content_ar },
      order: this.edit_classification.order
    }

    const sub = this.api.update('classifications/' + id, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { console.log(error); this.errorMessage = true; }
    );

    sub.add(() => { this.getClassifications(); });
  }

  create_classification() {
    let body = {
      parent_id: this.classification.parent_id,
      enable: this.classification.enable,
      name: { 'en': this.classification.name_en, 'ar': this.classification.name_ar },
      content: { 'en': this.classification.content_en, 'ar': this.classification.content_ar },
      order: this.classification.order
    }

    const sub = this.api.post("classifications/", body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { this.errorMessage = true; console.log(error); }
    );

    sub.add(() => { this.getClassifications(); });
  }
}
