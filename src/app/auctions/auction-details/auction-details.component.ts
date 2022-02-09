import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  auction: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let object = localStorage.getItem('auction') ? JSON.parse(localStorage.getItem('auction')) : null;
    
    if (object) { this.auction = object; }
    else { this.router.navigate(['auctions']); }
  }

}
