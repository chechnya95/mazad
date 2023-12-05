import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'userNameByLang'
})
export class UserNameByLangPipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  transform(details: string): string {
    // Fetch the language from localStorage or use the default locale
    let lang = localStorage.getItem('lang') || this.locale || 'en';
    lang = lang.split('-')[0];

    const fallbackLang = lang === 'en' ? 'ar' : 'en';

    // Parse the details JSON string to an object
    const obj = UtilitiesService.parseIfNotJsonObject(details);

    //const userDetails = obj[lang];
    //const userDetails = JSON.parse(details);

    // Check if the name for the specified language exists
    let name = obj[`name_${lang}`];

    // Check if name is not null or undefined, and also not an empty string
    if (name === null || name === undefined || name === '') {
      // If the primary language name is not valid, try the fallback language
      name = obj[`name_${fallbackLang}`];
    }

    // Check again if name is not null or undefined, and also not an empty string
    if (name !== null && name !== undefined && name !== '') {
      return name; // Return the name in the specified language or the fallback language
    } else {
      return ''; // Return a default name if neither name is available
    }
  }

}
