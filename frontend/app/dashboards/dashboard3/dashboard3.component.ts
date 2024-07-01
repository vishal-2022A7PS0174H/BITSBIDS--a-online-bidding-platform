import {Component, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component implements AfterViewInit {
  constructor(public translate: TranslateService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngAfterViewInit() {
  }
}
