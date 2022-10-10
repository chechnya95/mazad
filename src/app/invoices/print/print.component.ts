import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  invoice: any;

  constructor(public utility: UtilitiesService) { this.utility.show = false; }

  ngOnInit(): void {
    this.invoice = JSON.parse(localStorage.getItem('invoice'));
  }

  ngAfterViewInit(): void {
    window.print();
  }

}
