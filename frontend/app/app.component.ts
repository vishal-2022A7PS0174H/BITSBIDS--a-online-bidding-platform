import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public translate: TranslateService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang('us');

    if (localStorage.getItem('selected_lang') == null) {
      localStorage.setItem('selected_lang', 'us');
    }
  }
}
