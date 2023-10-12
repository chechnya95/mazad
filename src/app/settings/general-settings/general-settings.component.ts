import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  token: any;

  settings: any[] = [];
  types: any[] = [];

  setting = {
    category: null,
    key: null,
    value: null
  }

  edit_setting_id: any;
  edit_setting = {
    category: null,
    key: null,
    value: null
  }

  errorMessage: boolean = false;
  successMessage: boolean = false;

  constructor(public utility: UtilitiesService, private api: ApiService, public translate: TranslateService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.api.get('settings/', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data));
        this.settings = objects['settings'];
      },
      async error => { }
    );
  }

  editItemClicked(item: any) {
    this.edit_setting = item;
    this.edit_setting_id = item.category;
  }

  on_delete(key: any) {
    if (confirm("Delete this field?")) {
      const sub = this.api.delete("settings/" + key, this.token).subscribe(
        async data => { this.successMessage = true; },
        async error => { this.errorMessage = true; }
      );
      sub.add(() => { this.getSettings(); });
    }
  }

  OnUpdate(category: any) {
    let items: any[] = [];
    items.push({ 'key': this.edit_setting.key, 'value': this.edit_setting.value });

    let body = {
      items: items
    }

    const sub = this.api.update('settings/' + category, body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { this.errorMessage = true; }
    );

    sub.add(() => { this.getSettings(); });
  }

  onSubmit() {
    let items: any[] = [];
    items.push({ 'key': this.setting.key, 'value': this.setting.value });

    let body = {
      category: this.setting.category,
      items: items
    }

    const sub = this.api.post("settings/", body, this.token).subscribe(
      async data => { this.successMessage = true; },
      async error => { this.errorMessage = true; }
    );

    sub.add(() => { this.getSettings(); });
  }
}
