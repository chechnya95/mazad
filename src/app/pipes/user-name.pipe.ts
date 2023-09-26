import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  transform(user: any): string {
    if (!user) {
      return ''; // Return an empty string or some default value if user is not defined
    }
    // Fetch the language from localStorage or use the default locale
    const lang = localStorage.getItem('lang') || this.locale || 'en';
     // Check if the user object is null or undefined
    
    // Check if user_details is null or undefined
    if (!user.user_details) {
      return ''; // Return an empty string or some default value if user_details is not defined
    }

    // Parse the user details JSON string to an object
    const userDetails = JSON.parse(user.user_details);

    // Check if the name for the specified language exists
    const name = userDetails[`name_${lang}`];

    // Check if name is not null or undefined, and also not an empty string
    if (name !== null && name !== undefined && name !== '') {
      return name; // Return the name in the specified language
    }

    // If a name doesn't exist for the specified language, return the username
    return user.username;
  }

}
