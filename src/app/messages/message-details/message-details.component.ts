import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {

  message: any;
  token: any;

  constructor(private router: Router, private api: ApiService, public utility: UtilitiesService) {
    this.token = localStorage.getItem('access_token');
    this.utility.title = 'Message Details';
  }

  ngOnInit(): void {
    this.message = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : null;

    if (this.message) { }
    else { this.router.navigate(['messages']); }
  }
}
