import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './services/api.service';
import { MazadService } from './services/mazad.service';
import { UtilitiesService } from './services/utilities.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

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
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  constructor(
    public utility: UtilitiesService,
    private router: Router,
    public translate: TranslateService,
    private mazad: MazadService,
    private api: ApiService,
    private idle: Idle,
    keepalive: Keepalive,
    cd: ChangeDetectorRef) {
    translate.setDefaultLang('en');
    translate.use('en');
    idle.setIdle(1800); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(7200); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
      console.log('IDLE')
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      console.log('NOT_IDLE')
      console.log(`${this.idleState} ${new Date()}`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT"
      console.log('TIMED_OUT')
      if (this.api.isAllowedUser()) {
        this.onLogout();
      }
    });
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
    //this.api.isAccessTimeValid();
  }
  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    console.log('reset')
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    this.getInfo();
    this.api.isExpiredWorker();

    let lang = localStorage.getItem('lang');
    if (!lang)
      lang = 'en';
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.reset();
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
