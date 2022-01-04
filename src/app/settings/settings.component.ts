import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  token: any;
  category: string = 'company';

  update: boolean = false;
  company = {
    duraction: null,
    name: null,
    contact: null,
    site: null,
    country: 'OM',
    language: 'ar',
    zone: 'Muscat',
    currency: 'OMR',
  }

  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.get_settings();
  }

  get_settings() {
    const sub = this.api.get('settings/category/' + this.category, this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        let setting = objects['settings'];

        if (setting) { this.company = setting; this.update = true; }
        else { this.update = false; }
      },
      async error => {
        alert(error);
      }
    );
  }

  save_settings() {
    let items: any[] = [];

    items.push({ 'key': 'duraction', 'value': this.company.duraction });
    items.push({ 'key': 'name', 'value': this.company.name });
    items.push({ 'key': 'contact', 'value': this.company.contact });
    items.push({ 'key': 'site', 'value': this.company.site });
    items.push({ 'key': 'country', 'value': this.company.country });
    items.push({ 'key': 'language', 'value': this.company.language });
    items.push({ 'key': 'zone', 'value': this.company.zone });
    items.push({ 'key': 'currency', 'value': this.company.currency });

    let body = {
      category: this.category,
      items: items
    }

    if (this.update) {
      this.api.update("settings/" + this.category, body, this.token).subscribe(
        async data => { },
        async error => { console.log(error); }
      );
    }
    else {
      this.api.post("settings/", body, this.token).subscribe(
        async data => { },
        async error => { console.log(error); }
      );
    }
  }
}
