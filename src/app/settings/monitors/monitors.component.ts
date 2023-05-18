import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.css']
})
export class MonitorsComponent implements OnInit {

  token: any;
  jobs: any[] = [];
  redis: any[] = [];
  
  constructor(public utility: UtilitiesService, private api: ApiService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs() {
    const sub = this.api.get('admins/jobs', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.jobs = objects.jobs;
      },
      async error => { }
    );
    sub.add(() => { this.getRedis(); });
  }

  getRedis() {
    const sub = this.api.get('admins/redis', this.token).subscribe(
      async data => {
        let objects = JSON.parse(JSON.stringify(data))
        this.redis = objects;
        console.log(objects);
      },
      async error => { }
    );
  }

}
