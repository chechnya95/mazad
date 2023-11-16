import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './services/api.service';
import { MazadService } from './services/mazad.service';
import { UtilitiesService } from './services/utilities.service';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mazad-oman-dashboard';
  email: any;
  name: any;
  avatar: any;

  myAuctions: any;

  constructor(
    public utility: UtilitiesService,
    private router: Router,
    public translate: TranslateService,
    private mazad: MazadService,
    private api: ApiService,
    private bnIdle: BnNgIdleService) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.api.isAccessTimeValid();
    this.bnIdle.startWatching(1800000).subscribe((res) => {
      if (res && this.api.isAllowedUser()) {
        this.onLogout();
      }
      else {
        this.email = localStorage.getItem('email');
        this.name = localStorage.getItem('name');

        this.myAuctions = localStorage.getItem('myAuctions')
        if (!this.myAuctions)
          this.mazad.getAuctions();

        if (this.name)
          this.avatar = this.name.charAt(0);
      }
    });
  }

  ngOnInit(): void {
    this.getInfo();
    this.api.isExpiredWorker();

    let lang = localStorage.getItem('lang');
    if (!lang)
      lang = 'en';
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  switchLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getInfo() {
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');

    this.myAuctions = localStorage.getItem('myAuctions')
    if (!this.myAuctions)
      this.mazad.getAuctions();

    if (this.name)
      this.avatar = this.name.charAt(0);
  }
}
