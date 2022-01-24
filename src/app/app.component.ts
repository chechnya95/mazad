import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './services/api.service';
import { UtilitiesService } from './services/utilities.service';

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

  constructor(
    public utility: UtilitiesService,
    private router: Router,
    public translate: TranslateService,
    private api: ApiService) {
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    if (this.name)
      this.avatar = this.name.charAt(0);
  }

  ngOnInit(): void {
    this.api.isExpiredWorker();
  }

  switchLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
  
  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
