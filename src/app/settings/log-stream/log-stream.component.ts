import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-log-stream',
  templateUrl: './log-stream.component.html',
  styleUrls: ['./log-stream.component.css']
})

export class LogStreamComponent implements OnInit, OnDestroy{
  token: any;
  logs: string = '';
  eventSource: EventSource | undefined;

  constructor(public utility: UtilitiesService,private zone: NgZone) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.eventSource = new EventSource(environment.API_URL + 'admins/gcp/log_stream');
    this.eventSource.onmessage = (event) => {
      //this.logs += event.data + '\n';
      this.zone.run(() => {
        this.logs += event.data + '\n';
      });
    };
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

}
