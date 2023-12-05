import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'localName'
})
export class LocalNamePipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  transform(value: any): string {
    if (!value) {
      return ''; // Return an empty string or some default value if user is not defined
    }
     // Fetch the language from localStorage or use the default locale
    let lang = localStorage.getItem('lang') || this.locale || 'en';
    lang = lang.split('-')[0];
    // Define the fallback language based on the primary language
    const fallbackLang = lang === 'en' ? 'ar' : 'en';

    // Parse the user details JSON string to an object
    const obj = UtilitiesService.parseIfNotJsonObject(value);

    let local_value = obj[lang];
    // Check if name is not null or undefined, and also not an empty string
    if (local_value === null || local_value === undefined || local_value === '') {
      // If the primary language local_value is not valid, try the fallback language
      local_value = obj[fallbackLang];
    }

    // Check again if local_value is not null or undefined, and also not an empty string
    if (local_value !== null && local_value !== undefined && local_value !== '') {
      return local_value; // Return the name in the specified language or the fallback language
    } else {
      return ''; // Return a default name if neither name is available
    }
  }

}
