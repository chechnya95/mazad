import { Component, NgZone } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent {
  token: any;
  response: string = '';

  constructor(public utility: UtilitiesService,private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getUrl();
  }
  getUrl() {
    const sub = this.api.get('admins/url', this.token).subscribe(
      async data => {
        this.response = data.toString();
      },
      async error => { }
    );
  }
}
