import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private api: ApiService) {
    utility.url = '/';
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    if (this.name)
      this.avatar = this.name.charAt(0);
  }

  ngOnInit(): void {
    this.api.isExpiredWorker();
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
