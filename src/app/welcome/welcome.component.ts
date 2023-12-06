import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public utility: UtilitiesService, private router: Router, private api: ApiService,) {
    this.utility.show = false;
    
    if (!this.api.isAllowed({ allowAll: true }))
      this.router.navigateByUrl('/login');
  }

  ngOnInit(): void { }

  goHome() {
    this.router.navigateByUrl('/home');
  }
}
