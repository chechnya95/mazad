import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    const lang = localStorage.getItem('lang') || this.locale || 'en';

    // Parse the details JSON string to an object
    const userDetails = JSON.parse(details);

    // Check if the name for the specified language exists
    const name = userDetails[`name_${lang}`];

    // If a name exists for the specified language, return it; otherwise, return an empty string
    return name ? name : '';
  }

}
