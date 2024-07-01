import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {email} from 'ngx-custom-validators/src/app/email/validator';
import {LoggerService} from 'src/app/shared/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  loginData: FormGroup;
  submitted = false;

  loginform = true;
  recoverform = false;

  returnUrl: string;

  constructor(private getData: ApiManagerService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              public translate: TranslateService,
              private loggerService: LoggerService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.loginData = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'create-bid';
  }

  get fields() {
    return this.loginData.controls;
  }

  ngAfterViewInit() {
    if (this.route.snapshot.queryParams['verified'] === 'true') {
      this.alertService.success('succ_email_verified', {autoClose: true});
    }

    if (this.route.snapshot.queryParams['verified'] === 'false') {
      this.alertService.error('err_email_verify_expired', {autoClose: true});
    }
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  showLoginForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  public doLogin(): void {
    this.spinner.show();
    this.submitted = true;

    if (this.loginData.invalid) {
      this.spinner.hide();
      return;
    }

    this.getData.checkCredentials(this.loginData.value).subscribe((response: any) => {
        if (response.code === '403') {
          this.spinner.hide();
          this.alertService.error('err_not_active', {autoClose: true});
        } else {
          this.spinner.hide();
          this.loggerService.log('response', response);
          localStorage.setItem('user_token', response.accessToken);
          localStorage.setItem('user_id', response.id);
          localStorage.setItem('user_name', response.name);
          localStorage.setItem('user_username', response.username);
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error.status);
        if (error.status === 401) {
          this.alertService.error('err_invalid_cred', {autoClose: true});
        } else {
          this.alertService.error('err_common', {autoClose: true});
        }
      });
  }
}
