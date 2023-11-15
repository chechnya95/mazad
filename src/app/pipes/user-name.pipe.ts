import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../services/utilities.service';

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
    console.log('---inside user name pipe---')
    console.log(this.locale)
    console.log(lang);
    // Define the fallback language based on the primary language
    const fallbackLang = lang === 'en' ? 'ar' : 'en';
    
    // Check if user_details is null or undefined
    if (!user.user_details) {
      return ''; // Return an empty string or some default value if user_details is not defined
    }

    // Parse the user details JSON string to an object
    const userDetails = UtilitiesService.parseIfNotJsonObject(user.user_details);

    // Check if the name for the specified language exists
    let name = userDetails[`name_${lang}`];


    // Check if name is not null or undefined, and also not an empty string
    if (name === null || name === undefined || name === '') {
      // If the primary language name is not valid, try the fallback language
      name = userDetails[`name_${fallbackLang}`];
    }

    // Check again if name is not null or undefined, and also not an empty string
    if (name !== null && name !== undefined && name !== '') {
      return name; // Return the name in the specified language or the fallback language
    } else {
      return user.username; // Return a default name if neither name is available
    }
  }

}
