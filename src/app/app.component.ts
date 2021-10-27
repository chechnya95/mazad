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

  constructor(
    public utility: UtilitiesService,
    private router: Router,
    private api: ApiService) {
    utility.url = '/';
  }

  ngOnInit(): void {
    this.api.isExpiredWorker();
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
