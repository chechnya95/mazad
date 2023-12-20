import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { MdEditorOption } from 'ngx-markdown-editor';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-send-notifications',
  templateUrl: './send-notifications.component.html',
  styleUrls: ['./send-notifications.component.css']
})
export class SendNotificationsComponent implements OnInit {

  token: any;
  sms = {
    numbers: null,
    message: null,
    local: "AR"
  }

  email = {
    ids: null,
    message: null,
    subject: null
  }

  Swal = require('sweetalert2')

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    usingFontAwesome5: true,
    fontAwesomeVersion: '5',
    resizable: true,
    hideIcons: ['Image'],
  };

  public mode: string = 'editor';
  public markdownText: any;

  constructor(private api: ApiService,
    public utility: UtilitiesService) {
    this.utility.show = true;
    this.utility.loader = false;
    this.utility.title = 'Notifications';
    this.token = localStorage.getItem('access_token');
  }

  ngOnInit(): void {
  }

  sendSMS() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    let numbers: any[] = this.sms.numbers.split(';');

    numbers.forEach((number) => {
      let body = {
        mobile: number.trim(),
        message: this.sms.message,
        local: this.sms.local
      }

      let message, icon;

      const sub = this.api.post("sms_notifications/", body, this.token).subscribe(
        async data => {
          message = 'message sent successfully';
          icon = 'success';
        },
        async error => {
          message = 'cannot send message!';
          icon = 'error';
        }
      );

      sub.add(() => {
        Toast.fire({
          icon: icon,
          title: message
        })
      })
    });
  }

  sendEmail() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    let ids: any[] = this.email.ids.split(';');

    ids.forEach((id) => {
      let body = {
        email: id.trim(),
        message: this.email.message,
        subject: this.email.subject
      }

      let message, icon;

      const sub = this.api.post("email/", body, this.token).subscribe(
        async data => {
          message = 'message sent successfully';
          icon = 'success';
        },
        async error => {
          message = 'cannot send message!';
          icon = 'error';
        }
      );

      sub.add(() => {
        Toast.fire({
          icon: icon,
          title: message
        })
      })
    });
  }
}
