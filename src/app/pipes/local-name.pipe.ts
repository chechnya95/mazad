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
    // Parse the user details JSON string to an object
    const obj = UtilitiesService.parseIfNotJsonObject(value);

    const local_value = obj[lang];
    // Check if name is not null or undefined, and also not an empty string
    if (local_value !== null && local_value !== undefined && local_value !== '') {
      return local_value; // Return the name in the specified language
    }
    
    return '';
  }

}
