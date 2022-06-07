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

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
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

  on_delete(id: any) { }
  OnUpdate(id: any) { }

  create_classification() {
    let body = {
      parent_id: this.classification.parent_id,
      enable: this.classification.enable,
      name: { 'en': this.classification.name_en, 'ar': this.classification.name_ar },
      content: { 'en': this.classification.content_en, 'ar': this.classification.content_ar },
      order: this.classification.order
    }

    this.api.post("classifications/", body, this.token).subscribe(
      async data => {
        this.getClassifications();
      },
      async error => {
        alert("ERROR: cannot connect!");
        console.log(error);
      }
    );
  }
}
