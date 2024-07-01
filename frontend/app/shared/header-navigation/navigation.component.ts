import {Component, AfterViewInit, EventEmitter, Output, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {Router} from '@angular/router';
import {CommonService} from '../common.service';
import {LoggerService} from 'src/app/shared/logger.service';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};
  name = localStorage.getItem('user_name');
  username = localStorage.getItem('user_username');
  public showSearch = false;
  public selected_lang = 'fr';
  public available_balance: any;

  constructor(private router: Router,
              public commonService: CommonService,
              private loggerService: LoggerService) {
    if (localStorage.getItem('selected_lang') != null) {
      this.selected_lang = localStorage.getItem('selected_lang');
    } else {
      this.selected_lang = 'fr';
    }
  }

  changeLang(lang) {
    this.selected_lang = lang;
    localStorage.setItem('selected_lang', lang);
    this.loggerService.log('lang', lang);
    window.location.reload();
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    this.router.navigate(['authentication/login']);
  }
}
